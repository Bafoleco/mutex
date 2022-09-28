import { REGISTERED_TABS } from "../../../common/constants";
import { MUTEX_TURBO_PING_ALARM, TAB_SCREENSHOT_ALARM } from "../shared/constants";
import { getNumTabs } from "../shared/util";
import { turboTimerHandler } from "./turbo";

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === MUTEX_TURBO_PING_ALARM) {
    turboTimerHandler();
  }
});

export const setupAlarms = () => {
  chrome.alarms.create(MUTEX_TURBO_PING_ALARM, { periodInMinutes: 1 });
}