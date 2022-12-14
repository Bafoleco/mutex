import {
  REGISTERED_TABS, SERVER_URL,
  CLOUD_MESSAGING_SENDER_ID, MUTEX_TURBO_PERMISSION_REQS, ID, TURBO_STATE
} from "../../../common/constants";
import { setupTabChangeHandlers } from "./handle_tab_changes";
import { send_registered_tab_update } from "./messaging";
import { getNumTabs, setLocal } from "../shared/util";
import { setTurboHasPermissions } from "./turbo";
import { setupAlarms } from "./alarms";
import { RegisteredTabs } from "../../../common/types";

declare global {
  interface Crypto {
    randomUUID: () => string;
  }
}

//actions on chrome extension install
chrome.runtime.onInstalled.addListener(() => {
  console.log("Run setup activities.");
  const id = self.crypto.randomUUID();

  //initialize storage properly
  const initialRegisteredTabs: RegisteredTabs = { tabState: {}, activeTabs: { audibleTab: undefined, visibleTabs: {} } };
  setLocal(REGISTERED_TABS, initialRegisteredTabs);
  setLocal(ID, id);
  setLocal(TURBO_STATE, { hasPermissions: false, isRunning: false, isInstalled: false });

  //initialize cloud messaging
  chrome.gcm.register([CLOUD_MESSAGING_SENDER_ID], (registrationId) => {
    fetch(`${SERVER_URL}/registerExtension/${id}/${registrationId}`).then((response) => {
      console.log(response);
    });
  });

  //check whether we are in full permissions mode
  chrome.permissions.contains(MUTEX_TURBO_PERMISSION_REQS, (hasPermissions) => {
    setTurboHasPermissions(hasPermissions);
  });

  // Setup Alarms
  setupAlarms();
});

//setup tab change handlers
setupTabChangeHandlers();

//listen to storage changes
chrome.storage.onChanged.addListener((changes) => {
  for (const storageKey in changes) {
    if (storageKey == REGISTERED_TABS) {
      console.log("Storage Change: Registered Tabs");
      const numTabs = getNumTabs(changes[storageKey].newValue);
      console.log(changes[storageKey].newValue);
      // console.log("numTabs: " + numTabs);
      if (numTabs === 0) {
        chrome.action.setBadgeText({ text: "" });
      } else {
        chrome.action.setBadgeText({ text: numTabs.toString() });
      }
      send_registered_tab_update(changes[storageKey].newValue);
    }
  }
});

chrome.permissions.onRemoved.addListener(() => {
  console.log("permissions removed");
  chrome.permissions.contains(MUTEX_TURBO_PERMISSION_REQS, (hasPermissions) => {
    setTurboHasPermissions(hasPermissions);
  });
});

chrome.permissions.onAdded.addListener(() => {
  console.log("permissions added");
  chrome.permissions.contains(MUTEX_TURBO_PERMISSION_REQS, (hasPermissions) => {
    setTurboHasPermissions(hasPermissions);
  });
});