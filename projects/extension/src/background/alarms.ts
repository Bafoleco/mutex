import { REGISTERED_TABS } from "../../../common/constants";
import { MUTEX_TURBO_PING_ALARM, TAB_SCREENSHOT_ALARM } from "../shared/constants";
import { getNumTabs } from "../shared/util";
import { turboTimerHandler } from "./turbo";

export const setupAlarms = () => {
  chrome.alarms.create(MUTEX_TURBO_PING_ALARM, { periodInMinutes: 1 });

  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === MUTEX_TURBO_PING_ALARM) {
      turboTimerHandler();
    }
  });

  chrome.storage.onChanged.addListener((changes) => {
    // console.log("Storage Change: Registered Tabs in Alarms");
    for (const storageKey in changes) {
      if (storageKey == REGISTERED_TABS) {
        const newNumTabs = getNumTabs(changes[storageKey].newValue);
        const oldNumTabs = getNumTabs(changes[storageKey].oldValue);
        // console.log("oldNumTabs: " + oldNumTabs);
        // console.log("newNumTabs: " + newNumTabs);
        if (newNumTabs == 0 && oldNumTabs > 0) {
          console.log("No more registered tabs. Clearing Tab Screenshot Alarm.");
          // chrome.alarms.clear(TAB_SCREENSHOT_ALARM);
        }
        if (oldNumTabs == 0 && newNumTabs > 0) {
          // console.log("Starting Tab Screenshot Alarm");
          chrome.alarms.create(TAB_SCREENSHOT_ALARM, { periodInMinutes: 1 });
        }
      }
    }
  });
}