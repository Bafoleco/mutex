import { VisibleTabs } from "../../../common/types";
import { storeFullscreenState, restoreFullscreenState } from "./fullscreen_handling";
import { isTurboRunning } from "./turbo";

const makeTabVisible = async (tabId: number, windowId: number, turboRunning: boolean) => {
  await Promise.all([chrome.tabs.update(tabId, { active: true }), chrome.windows.update(windowId, { focused: true })]);
  if (turboRunning) {
    restoreFullscreenState(tabId, windowId);
  }
}

export const switchVisibleTabs = async (newVisibleTabs: VisibleTabs, oldVisibleTabs: VisibleTabs) => {
  console.log("switching visible tabs");
  Object.keys(newVisibleTabs).forEach(async (windowId) => {
    const visibleTabId = newVisibleTabs[windowId];
    const oldVisibleTabId = oldVisibleTabs[windowId];
    console.log("visibleTabId: " + visibleTabId);
    console.log("windowId: " + windowId);

    if (visibleTabId && visibleTabId !== oldVisibleTabId) {
      console.log("visibleTabId: " + visibleTabId);
      const turboRunning = await isTurboRunning();
      console.log("turboRunning: " + turboRunning);
      if (oldVisibleTabId !== undefined && turboRunning) {
        console.log("turbo is running, store fullscreen state");
        await storeFullscreenState(oldVisibleTabId);
      }
      console.log("making tab visible");
      makeTabVisible(visibleTabId, parseInt(windowId), turboRunning);
    }
  });
};

export const switchAudibleTab = (newAudibleTabId: number, oldAudibleTabId: number) => {
  if (oldAudibleTabId) {
    chrome.tabs.update(oldAudibleTabId, { muted: true });
  }
  chrome.tabs.update(newAudibleTabId, { muted: false });
};