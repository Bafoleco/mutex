import './App.css';
import React from 'react';
import { ACTIVE_TABS_UPDATE, PAUSE_UPDATE, WINDOW_FOCUS_UPDATE } from '../../common/constants';
import { send_message } from './util';
import { WindowDisplay } from './WindowDisplay';
import { RegisteredTabs, VisibleTabs } from '../../common/types';
import Stack from 'react-bootstrap/Stack';

type TabDisplayProps = {
  registeredTabs: RegisteredTabs,
  id: string
}

const TabDisplay = (props: TabDisplayProps) => {

  const {registeredTabs, id} = props;

  const [audibleTab, setAudibleTab] = React.useState<undefined | number>(undefined);
  const [visibleTabs, setVisibleTabs] = React.useState<VisibleTabs>({});

  const getOnClickFunction = (windowId: number, tabId: number) => {
    return () => {
      console.log("click on tab");
      setAudibleTab(tabId);

      const newVisibleTabs = {...visibleTabs};
      newVisibleTabs[windowId] = tabId;
      setVisibleTabs(newVisibleTabs);

      console.log(newVisibleTabs);

      send_message(ACTIVE_TABS_UPDATE, id, {
        audibleTab: tabId,
        visibleTabs: newVisibleTabs
      });
    }
  }

  const getOnPauseChange = (windowId: number, tabId: number) => {
    return (pauseState: boolean) => {
      send_message(PAUSE_UPDATE, id, {
        tabId: tabId,
        windowId: windowId, 
        pauseState: pauseState
      });
    }
  }  

  const sendWindowFocusUpdate = (windowId: number) => {
    send_message(WINDOW_FOCUS_UPDATE, id, {
      windowToFocus: windowId
    })
  }

  return (
    <Stack gap={2} style={{margin: '0.25rem'}}>
      {
        Object.keys(registeredTabs).map((windowId, index) => <WindowDisplay key={windowId} 
          windowId={parseInt(windowId)} 
          index={index} 
          getOnClickFunction={getOnClickFunction} 
          windowTabs={registeredTabs[windowId]} 
          audibleTab={audibleTab}
          visibleTab={visibleTabs[windowId]}
          getOnPauseChange={getOnPauseChange}
          sendWindowFocusUpdate={sendWindowFocusUpdate}
        />)
      }
    </Stack>
  );
}

export default TabDisplay;