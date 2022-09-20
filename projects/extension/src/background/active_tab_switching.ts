import { transform } from "@babel/core";
import { VisibleTabs } from "../../../common/types";
import { AUDIBLE_TAB, VISIBLE_TABS } from "../shared/constants";
import { getLocalAsync, setLocal, transformRegisteredTabs } from "../shared/util";
import { storeFullscreenState, restoreFullscreenState } from "./fullscreen_handling";
import { isTurboRunning } from "./turbo";

export const switchActiveTabs = async (audibleTab: number | undefined, visibleTabs: VisibleTabs) => {
  transformRegisteredTabs(async (registeredTabs) => {
    await Promise.all([switchAudibleTab(audibleTab, registeredTabs.activeTabs.audibleTab), switchVisibleTabs(visibleTabs, registeredTabs.activeTabs.visibleTabs)]);
    registeredTabs.activeTabs.audibleTab = audibleTab;
    registeredTabs.activeTabs.visibleTabs = visibleTabs;
    return registeredTabs;
  });
}

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
    // console.log("visibleTabId: " + visibleTabId);
    // console.log("windowId: " + windowId);

    if (visibleTabId && visibleTabId !== oldVisibleTabId) {
      // console.log("visibleTabId: " + visibleTabId);
      const turboRunning = await isTurboRunning();
      // console.log("turboRunning: " + turboRunning);
      if (oldVisibleTabId !== undefined && turboRunning) {
        // console.log("turbo is running, store fullscreen state");
        await storeFullscreenState(oldVisibleTabId);
      }
      // console.log("making tab visible");
      makeTabVisible(visibleTabId, parseInt(windowId), turboRunning);
    }
  });
};

// export const makeTabAudible = async (tabId: number) => {

//   const audibleTabId = await getLocalAsync(AUDIBLE_TAB);
//   if (audibleTabId) {
//     await chrome.tabs.update(audibleTabId, { muted: true });
//   }
//   await chrome.tabs.update(tabId, { muted: false });

// };

//is it a ridiculous micro optimization to not just refetch all tab info, on handlers?
export const switchAudibleTab = async (newAudibleTabId: number | undefined, oldAudibleTabId: number | undefined) => {
  if (newAudibleTabId) {
    if (oldAudibleTabId) {
      await Promise.all([chrome.tabs.update(newAudibleTabId, { muted: false }), chrome.tabs.update(oldAudibleTabId, { muted: true })]);
    } else {
      await Promise.all([chrome.tabs.update(newAudibleTabId, { muted: false })]);
    }
  }
};