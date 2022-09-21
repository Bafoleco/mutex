import './App.css';
import React from 'react';
import { ACTIVE_TABS_UPDATE, WINDOW_FOCUS_UPDATE } from '../../common/constants';
import { send_message } from './util';
import { WindowDisplay } from './WindowDisplay';
import { RegisteredTabs, VisibleTabs } from '../../common/types';
import Stack from 'react-bootstrap/Stack';

type TabDisplayProps = {
  registeredTabs: RegisteredTabs,
  id: string
}

const TabDisplay = (props: TabDisplayProps) => {

  // console.log("rendering tab display");
  const { registeredTabs, id } = props;
  const [audibleTab, setAudibleTab] = React.useState<undefined | number>(undefined);
  const [visibleTabs, setVisibleTabs] = React.useState<VisibleTabs>({});

  React.useEffect(() => {
    setVisibleTabs(registeredTabs.activeTabs.visibleTabs);
    setAudibleTab(registeredTabs.activeTabs.audibleTab);
  }, [registeredTabs]);

  const getOnClickFunction = (windowId: number, tabId: number) => {
    return () => {
      console.log("click on tab");
      setAudibleTab(tabId);

      const newVisibleTabs = { ...visibleTabs };
      newVisibleTabs[windowId] = tabId;
      setVisibleTabs(newVisibleTabs);

      console.log(newVisibleTabs);

      send_message(ACTIVE_TABS_UPDATE, id, {
        audibleTab: tabId,
        visibleTabs: newVisibleTabs
      });
    }
  }

  const sendWindowFocusUpdate = (windowId: number) => {
    send_message(WINDOW_FOCUS_UPDATE, id, {
      windowToFocus: windowId
    })
  }

  if (Object.keys(registeredTabs.tabState).length === 0) {
    return (
      <div style={{ width: '90%', margin: 'auto', padding: '1rem' }}>
        <h4 style={{ textAlign: 'center' }}> Time to activate some tabs! </h4>
        <div style={{ margin: 'auto', textAlign: 'center' }}>
          <ol style={{ textAlign: 'left', display: 'inline-block' }}>
            <li>In Chrome, open Mutex in the tab you wish to control.</li>
            <li>Click the green "Activate Tab" button.</li>
            <li>You should now be able to see and control the tab here!</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <Stack gap={0} style={{ margin: '0.25rem', backgroundImage: "url('blur.jpg')" }}>
      {
        Object.keys(registeredTabs.tabState).map((windowId, index) => <WindowDisplay key={windowId}
          windowId={parseInt(windowId)}
          index={index}
          getOnClickFunction={getOnClickFunction}
          windowTabs={registeredTabs.tabState[windowId]}
          audibleTab={audibleTab}
          visibleTab={visibleTabs[windowId]}
          sendWindowFocusUpdate={sendWindowFocusUpdate}
        />)
      }
    </Stack>
  );
}

export default TabDisplay;