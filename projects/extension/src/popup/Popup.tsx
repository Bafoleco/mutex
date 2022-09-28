import React from 'react';
import './Popup.scss';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import { getLocal, registerTab, deregisterTab, getLocalAsync } from "../shared/util";
import { ID, MUTEX_TURBO_URI, REGISTERED_TABS, REMOTE_URL, TURBO_STATE } from "../../../common/constants";
import { setTurboIsInstalled } from '../background/turbo';
import Pairing from './Pairing';
import { RegisteredTabs, TurboState } from '../../../common/types';
import { MUTEX_TURBO_PERMISSION_REQS } from '../shared/constants';

const chromeSetup = (setTurboState: React.Dispatch<React.SetStateAction<TurboState | undefined>>) => {
  chrome.storage.onChanged.addListener((changes) => {
    for (const storageKey in changes) {
      if (storageKey == TURBO_STATE) {
        console.log("turbo state changed");
        const turboState = changes[storageKey].newValue;
        console.log(turboState);
        setTurboState(turboState);
      }
    }
  });

  getLocal(TURBO_STATE, (turboState: TurboState) => {
    setTurboState(turboState);
  });
}

const enableTurbo = () => {
  chrome.permissions.request(MUTEX_TURBO_PERMISSION_REQS);
}

const handleTurboInstalled = () => {
  setTurboIsInstalled(true);
}

const openTurbo = (id: string) => {
  chrome.tabs.create({ url: `${MUTEX_TURBO_URI}open/id/${id}` });
}

const handleTurboState = (turboState: TurboState, id: string | undefined) => {
  console.log("handle turbo state");
  console.log(turboState);
  if (!turboState.hasPermissions) {
    console.log("does not have permissions");
    return (
      <Button variant="outline-primary" onClick={() => enableTurbo()}> Enable Turbo </Button>
    )
  } else if (turboState.hasPermissions && !turboState.isInstalled) {
    console.log("has permissions but not installed");
    return (
      <Stack direction="horizontal" gap={1}>
        <Button style={{ width: '50%' }} variant="outline-primary" href={`${REMOTE_URL}/goturbo`} target="_blank"> Install Mutex Turbo </Button>
        <Button style={{ width: '50%' }} variant="outline-primary" onClick={() => handleTurboInstalled()}> I've Installed Mutex Turbo </Button>
      </Stack>
    )
  } else if (turboState.isInstalled && !turboState.isRunning) {
    console.log("has permissions and is installed but not running");
    if (id) {
      return (
        <Button variant="outline-primary" onClick={() => openTurbo(id)}> Start Turbo </Button>
      );
    } else {
      return <Button variant="outline-primary" disabled> Start Turbo </Button>
    }
  }
}

const checkTabRegistration = async (setTabRegistered: React.Dispatch<React.SetStateAction<boolean | undefined>>,
  setTab: React.Dispatch<React.SetStateAction<chrome.tabs.Tab | undefined>>) => {

  const [matches, registeredTabsFromStorage] = await Promise.all([
    chrome.tabs.query({ active: true, currentWindow: true }),
    getLocalAsync(REGISTERED_TABS)
  ]);

  const registeredTabs = registeredTabsFromStorage as RegisteredTabs;

  const currentTab = matches[0];
  setTab(currentTab);

  const windowId = currentTab.windowId;
  const tabId = currentTab.id

  // console.log("INITIAL STATE");
  // console.log(currentTab);
  // console.log("current tab id: " + tabId);
  // console.log("current registerd tabs:")
  // console.log(registeredTabs);

  if (tabId) {
    if (windowId in registeredTabs.tabState && tabId in registeredTabs.tabState[windowId]) {
      setTabRegistered(true);
    } else {
      setTabRegistered(false);
    }
  }
}

const deregisterTabHandler = async (tab: chrome.tabs.Tab, setTabRegistered: React.Dispatch<React.SetStateAction<boolean | undefined>>) => {
  await deregisterTab(tab);
  setTabRegistered(false);
}

const registerTabHandler = async (tab: chrome.tabs.Tab, setTabRegistered: React.Dispatch<React.SetStateAction<boolean | undefined>>) => {
  console.log("activating tab");
  await registerTab(tab);
  setTabRegistered(true);
}

const getRegisterButton = (tab: chrome.tabs.Tab, tabRegistered: boolean, setTabRegistered: React.Dispatch<React.SetStateAction<boolean | undefined>>) => {
  if (tabRegistered) {
    return (
      <Button variant="danger" onClick={() => { deregisterTabHandler(tab, setTabRegistered) }}> Deactivate Tab </Button>
    );
  } else {
    return (
      <Button variant="success" onClick={() => { registerTabHandler(tab, setTabRegistered) }}>  Activate Tab </Button>
    );
  }
}

const Popup = () => {
  console.log("RENDERING POPUP");
  const [turboState, setTurboState] = React.useState<TurboState | undefined>(undefined);
  const [tabRegistered, setTabRegistered] = React.useState<boolean | undefined>(false);
  const [tab, setTab] = React.useState<chrome.tabs.Tab | undefined>(undefined);
  const [id, setId] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    chromeSetup(setTurboState);
    checkTabRegistration(setTabRegistered, setTab);
    getLocal(ID, (id) => {
      setId(id);
    });
  }, []);

  return (
    <Col style={{ height: "100%", width: '100%' }}>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand style={{ margin: 'auto' }}>
            Mutex Extension
          </Navbar.Brand>
        </Container>
        {turboState?.isRunning &&
          <img style={{ width: '7%', marginLeft: '-11%', marginRight: '4%' }} src="../assets/img/turbo-icon.svg" />
        }
      </Navbar>

      <Stack gap={2} style={{ padding: '0.5rem' }}>
        {tabRegistered !== undefined && tab !== undefined ?
          getRegisterButton(tab, tabRegistered, setTabRegistered)
          : <div style={{ height: 'var(--bs-btn-line-height)' }}> </div>
        }
        {id && <Pairing id={id} />}
        {turboState && handleTurboState(turboState, id)}
      </Stack>
    </Col>
  );
};

export default Popup;
