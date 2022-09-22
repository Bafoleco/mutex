import {
  ID, REQUEST_UPDATE, TURBO_UPDATE,
  ACTIVE_TABS_UPDATE, VISIBLE_TABS, SERVER_URL, REGISTERED_TAB_UPDATE, REGISTERED_TABS, AUDIBLE_TAB, TURBO_STATE, PAUSE_UPDATE, WINDOW_FOCUS_UPDATE
} from '../../../common/constants'
import { ActiveTabs, Message, RegisteredTabs, TurboStateUpdate, WindowFocusUpdate } from '../../../common/types';
import { getLocal, getLocalAsync, mergeLocal, setLocal } from "../shared/util";
import { switchActiveTabs } from './active_tab_switching';
import { sendTurboHeartbeat } from './turbo';


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
    handleTurboUpdate(message.payload.stateUpdate);
  }
  if (message.type === WINDOW_FOCUS_UPDATE) {
    handleWindowFocusUpdate(message.payload);
  }
});

const handleRequestUpdate = async () => {
  console.log("registered tabs update requested");
  const registeredTabs = await getLocalAsync(REGISTERED_TABS);
  send_registered_tab_update(registeredTabs);
}

const handleActiveTabsUpdate = async (activeTabs: ActiveTabs) => {
  console.log("handleActiveTabsUpdate");
  const audibleTab = activeTabs.audibleTab;
  const visibleTabs = activeTabs.visibleTabs;

  switchActiveTabs(audibleTab, visibleTabs);
}

const handleTurboUpdate = (turboUpdate: TurboStateUpdate) => {
  console.log("turbo update backend");
  console.log(turboUpdate);
  mergeLocal(TURBO_STATE, turboUpdate);
  sendTurboHeartbeat();
}

const handleWindowFocusUpdate = (windowFocusUpdate: WindowFocusUpdate) => {
  const windowToFocus = windowFocusUpdate.windowToFocus;
  chrome.windows.update(windowToFocus, { focused: true });
}

export const send_registered_tab_update = (registeredTabs: RegisteredTabs) => {
  console.log('SEND REGISTERED TAB UPDATE');
  getLocal(ID, (id) => {
    const body = {
      message: { id: id, type: REGISTERED_TAB_UPDATE, payload: registeredTabs }
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