import React from 'react';
import './Popup.scss';
import { Col, Container, Nav, Navbar, Stack } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { getLocal, setClipboard, registerTab, deregisterTab, setLocal } from "../shared/util";
import { FULL_PERMISSIONS, ID, MUTEX_TURBO_URI, REGISTERED_TABS, REMOTE_URL, TURBO_STATE } from "../../../common/constants";
import { turboTimerHandler, setTurboHasPermissions, setTurboIsRunning, setTurboIsInstalled } from '../background/turbo';
import Pairing from './Pairing';
import { TurboState } from '../../../common/types';
import bootstrap from 'bootstrap'

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

const reqsForScriptInjection = {
  origins: ["<all_urls>"],
  permissions: ["scripting"]
}

const enableTurbo = () => {
  chrome.permissions.request(reqsForScriptInjection);
}

const handleTurboInstalled = () => {
  setTurboIsInstalled(true);
}

const openTurbo = () => {
  chrome.tabs.create({ url: `${MUTEX_TURBO_URI}/open` });
}

const handleTurboState = (turboState: TurboState) => {
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
    return (
      <Button variant="outline-primary" onClick={() => openTurbo()}> Start Turbo </Button>
    );
  }
}

const checkTabRegistration = (setTabRegistered: React.Dispatch<React.SetStateAction<boolean | undefined>>) => {
  getLocal(REGISTERED_TABS, (oldRegisteredTabs) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (matches) => {
      const currentTab = matches[0];
      const windowId = currentTab.windowId;
      const tabId = currentTab.id

      console.log(currentTab);
      console.log("current tab id: " + tabId);

      if (tabId) {
        if (windowId in oldRegisteredTabs && tabId in oldRegisteredTabs[windowId]) {
          setTabRegistered(true);
        } else {
          setTabRegistered(false);
        }
      }
    });
  });
}

const deregisterTabHandler = (tab: chrome.tabs.Tab, setTabRegistered: React.Dispatch<React.SetStateAction<boolean | undefined>>) => {
  deregisterTab(tab, () => { setTabRegistered(false); });
}

const registerTabHandler = (tab: chrome.tabs.Tab, setTabRegistered: React.Dispatch<React.SetStateAction<boolean | undefined>>) => {
  registerTab(tab, () => { setTabRegistered(true); });
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

  const [turboState, setTurboState] = React.useState<TurboState | undefined>(undefined);
  const [tabRegistered, setTabRegistered] = React.useState<boolean | undefined>(false);
  const [tab, setTab] = React.useState<chrome.tabs.Tab | undefined>(undefined);
  const [id, setId] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    chromeSetup(setTurboState);
    checkTabRegistration(setTabRegistered);
    chrome.tabs.query({ active: true, currentWindow: true }, (matches) => {
      const currentTab = matches[0];
      setTab(currentTab);
    });
    getLocal(ID, (id) => {
      setId(id);
    });
  }, []);

  return (
    <Col style={{ height: "100%", width: '100%' }}>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand style={{ margin: 'auto' }}>
            Mutex Remote
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
        {turboState && handleTurboState(turboState)}
      </Stack>
    </Col>
  );
};

export default Popup;
