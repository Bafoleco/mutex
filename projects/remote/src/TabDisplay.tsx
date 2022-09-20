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

// const getVisibleTabs = (registeredTabs: RegisteredTabs): VisibleTabs => {
//   console.log("getting visible tabs");
//   const visibleTabs: VisibleTabs = {};
//   for (const windowId in registeredTabs) {
//     const windowTabs = registeredTabs[windowId];
//     for (const tabId in windowTabs) {
//       const tab = windowTabs[tabId];
//       console.log(tab);
//       if (tab.active) {
//         console.log("found active tab");
//         visibleTabs[windowId] = parseInt(tabId);
//       }
//     }
//   }
//   console.log("returning visible tabs");
//   console.log(visibleTabs);
//   return visibleTabs;
// }

// const getAudibleTab = (registeredTabs: RegisteredTabs): number | undefined => {
//   console.log("getting audible tab");
//   for (const windowId in registeredTabs) {
//     const windowTabs = registeredTabs[windowId];
//     for (const tabId in windowTabs) {
//       const tab = windowTabs[tabId];
//       if (!tab.muted) {
//         console.log("found audible tab");
//         return parseInt(tabId);
//       }
//     }
//   }
//   return undefined;
// }

const TabDisplay = (props: TabDisplayProps) => {

  // console.log("rendering tab display");
  const { registeredTabs, id } = props;
  const [audibleTab, setAudibleTab] = React.useState<undefined | number>(undefined);
  const [visibleTabs, setVisibleTabs] = React.useState<VisibleTabs>({});

  React.useEffect(() => {
    setVisibleTabs(registeredTabs.activeTabs.visibleTabs);
    setAudibleTab(registeredTabs.activeTabs.audibleTab);
  }, [registeredTabs]);

  // console.log("visible tabs: ");
  // console.log(visibleTabs);

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
    <Stack gap={0} style={{ margin: '0.25rem', backgroundImage: "url('blur.jpg')" }}>
      {
        Object.keys(registeredTabs.tabState).map((windowId, index) => <WindowDisplay key={windowId}
          windowId={parseInt(windowId)}
          index={index}
          getOnClickFunction={getOnClickFunction}
          windowTabs={registeredTabs.tabState[windowId]}
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