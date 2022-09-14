import { ID, REQUEST_UPDATE, TURBO_UPDATE,
        ACTIVE_TABS_UPDATE, VISIBLE_TABS, SERVER_URL, REGISTERED_TAB_UPDATE, REGISTERED_TABS, AUDIBLE_TAB, TURBO_STATE, PAUSE_UPDATE, WINDOW_FOCUS_UPDATE} from '../../../common/constants'
import { ActiveTabs, Message, RegisteredTabs, TurboStateUpdate, WindowFocusUpdate } from '../../../common/types';
import {getLocal, mergeLocal, setLocal} from "../shared/util";


type MessageData = {
  message: string
}

chrome.gcm.onMessage.addListener((notification) => {
  console.log("got push notification!!");

  const message: Message = JSON.parse((notification.data as MessageData).message);

  console.log(message);
  if (message.type == REQUEST_UPDATE) {
    handleRequestUpdate();
  }
  if (message.type == ACTIVE_TABS_UPDATE) {
    handleActiveTabsUpdate(message.payload);
  }
  if (message.type === TURBO_UPDATE) {
    handleTurboUpdate(message.payload);
  }
  // if (message.type === PAUSE_UPDATE) {
  //   handlePauseUpdate(message.payload);
  // }
  if (message.type === WINDOW_FOCUS_UPDATE) {
    handleWindowFocusUpdate(message.payload);
  }
});

const handleRequestUpdate = () => {
  console.log("registered tabs update requested");
  getLocal(REGISTERED_TABS, (registeredTabs) => {
    send_registered_tab_update(registeredTabs)
  });
}

const handleActiveTabsUpdate = (activeTabs: ActiveTabs) => {
  const audibleTab = activeTabs.audibleTab;
  const visibleTabs = activeTabs.visibleTabs;
  setLocal(AUDIBLE_TAB, audibleTab);
  setLocal(VISIBLE_TABS, visibleTabs);
}

const handleTurboUpdate = (turboUpdate: TurboStateUpdate) => {
  console.log("turbo update backend");
  mergeLocal(TURBO_STATE, turboUpdate);
  // sendTurboHeartbeat();
}

const handleWindowFocusUpdate = (windowFocusUpdate: WindowFocusUpdate) => {
  const windowToFocus = windowFocusUpdate.windowToFocus;
  chrome.windows.update(windowToFocus, { focused: true});
}

// const handlePauseUpdate = (pauseUpdate) => {
//   console.log("pause update backend");
  
//   const tabId = pauseUpdate.tabId;
//   const windowId = pauseUpdate.windowId;
//   const pauseState = pauseUpdate.pauseState;

//   getLocal(REGISTERED_TABS, (registeredTabs) => {
//     if (windowId in registeredTabs) {
//       if (tabId in registeredTabs[windowId]) {
//         registeredTabs[windowId][tabId].pauseState = pauseState;
//         return;
//       }
//     }
//     console.log("desired tab/window is not registered and so its pause state cannot be updated");
//   });
// }

export const send_registered_tab_update = (registeredTabs: RegisteredTabs) => {
  console.log('send registered tab update');
  getLocal(ID, (id) => {
    const body = {
      message: {id: id, type: REGISTERED_TAB_UPDATE, payload: registeredTabs}
    };
    
    console.log("post to: " + SERVER_URL + "/sendDataToRemote/" + id);
    fetch(SERVER_URL + "/sendDataToRemote/" + id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then((response) => {
      console.log(response);
    });
  });
};