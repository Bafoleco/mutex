import { Tab } from "bootstrap";
import { RegisteredTabs, TabInfo, WindowState } from "../../../common/types";
import { getTabInfo, getTabInfoId, transformRegisteredTabs } from "../shared/util";

export const tabMoveTransformer = async (registeredTabs: RegisteredTabs, tabId: number, moveInfo: chrome.tabs.TabMoveInfo, getTabInfoId: (arg0: number) => Promise<TabInfo>) => {
  const windowId = moveInfo.windowId;
  const newRegisteredTabs = { ...registeredTabs };

  const newWindowInfo: WindowState = {};
  const oldWindowInfo: WindowState = registeredTabs.tabState[windowId];

  if (oldWindowInfo === undefined) {
    return registeredTabs;
  }

  await Promise.all(Object.keys(oldWindowInfo).map(async (tabId) => {
    newWindowInfo[tabId] = await getTabInfoId(parseInt(tabId));
  }));

  newRegisteredTabs.tabState[windowId] = newWindowInfo;

  return newRegisteredTabs;
}

export const tabRemoveTransformer = async (registeredTabs: RegisteredTabs, tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) => {
  const windowId = removeInfo.windowId;

  const newRegisteredTabs = { ...registeredTabs };
  const newWindowInfo: WindowState = { ...registeredTabs.tabState[windowId] };

  delete newWindowInfo[tabId];
  if (Object.keys(newWindowInfo).length > 0) {
    newRegisteredTabs.tabState[windowId] = newWindowInfo;
  } else {
    delete newRegisteredTabs.tabState[windowId];
    delete newRegisteredTabs.activeTabs.visibleTabs[windowId];
  }

  if (registeredTabs.activeTabs.audibleTab === tabId) {
    newRegisteredTabs.activeTabs.audibleTab = undefined;
  }

  console.log("saving to storage");
  console.log(newRegisteredTabs);

  return newRegisteredTabs;
};

export const tabUpdateTransformer = (registerTabs: RegisteredTabs, tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {

  console.log("tab update transformer");
  console.log(changeInfo);

  const windowId = tab.windowId;
  if (windowId in registerTabs.tabState && tabId in registerTabs.tabState[windowId]) {

    // muting a tab from outside the extension is undefined behaviour
    if (changeInfo.mutedInfo && changeInfo.mutedInfo.reason === 'extension') {
      console.log('muted by extension - doing nothing');
      return registerTabs;
    }

    const newRegisteredTabs = { ...registerTabs };
    const newWindowInfo = { ...registerTabs.tabState[windowId] };

    newWindowInfo[tabId] = getTabInfo(tab);
    newRegisteredTabs.tabState[windowId] = newWindowInfo;

    return newRegisteredTabs;
  }
  return registerTabs;
};

export const tabAttachedTransformer = async (registeredTabs: RegisteredTabs, attachedTabId: number, attachInfo: chrome.tabs.TabAttachInfo, getTabInfoId: (arg0: number) => Promise<TabInfo>) => {
  const newWindowId = attachInfo.newWindowId;

  let wasFound = false;
  let oldWindowId = undefined;
  Object.keys(registeredTabs.tabState).forEach((windowId) => {
    const windowState = registeredTabs.tabState[windowId];
    if (attachedTabId in windowState) {
      wasFound = true;
      oldWindowId = windowId;
    }
  });

  if (!wasFound || !oldWindowId) {
    return registeredTabs;
  }

  // delete tab in old window. What tab is now visible?
  delete registeredTabs.tabState[oldWindowId][attachedTabId];
  if (Object.keys(registeredTabs.tabState[oldWindowId]).length == 0) {
    delete registeredTabs.tabState[oldWindowId];
    delete registeredTabs.activeTabs.visibleTabs[oldWindowId];
  }

  const newRegisteredTabs = { ...registeredTabs };
  if (!(newWindowId in newRegisteredTabs.tabState)) {
    newRegisteredTabs.tabState[newWindowId] = {};
  }
  newRegisteredTabs.tabState[newWindowId][attachedTabId] = await getTabInfoId(attachedTabId);

  // set visible status - assumption: if tab is just attached, it is visible
  newRegisteredTabs.activeTabs.visibleTabs[newWindowId] = attachedTabId;

  // console.log('registered tabs after ATTACH');
  // console.log(newRegisteredTabs);
  return newRegisteredTabs;
};

//RAW MODIFICATION OF REGISTERED TABS
export const tabActivatedTransformer = async (registeredTabs: RegisteredTabs, activeInfo: chrome.tabs.TabActiveInfo) => {
  const windowId = activeInfo.windowId;
  const windowTabs = registeredTabs.tabState[windowId];

  if (windowTabs) {
    registeredTabs.activeTabs.visibleTabs[windowId] = activeInfo.tabId;
  }

  return registeredTabs;
};

export const handle_tab_move = async (tabId: number, moveInfo: chrome.tabs.TabMoveInfo) => {
  console.log("handle tab move: " + tabId);
  transformRegisteredTabs(async (registeredTabs) => {
    return tabMoveTransformer(registeredTabs, tabId, moveInfo, getTabInfoId);
  });
};

export const handle_tab_remove = async (tabId: number, moveInfo: chrome.tabs.TabRemoveInfo) => {
  console.log("handle tab remove: " + tabId);
  transformRegisteredTabs(async (registeredTabs) => {
    return tabRemoveTransformer(registeredTabs, tabId, moveInfo);
  });
};

const handle_tab_update = async (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
  console.log("handle tab update: " + tabId);
  transformRegisteredTabs(async (registeredTabs) => {
    return tabUpdateTransformer(registeredTabs, tabId, changeInfo, tab);
  });
};

const handle_tab_replace = async (addedTabId: number, removedTabId: number) => {
  console.log('tab replace triggered?');
};

const handle_tab_attached = async (attachedTabId: number, attachInfo: chrome.tabs.TabAttachInfo) => {
  console.log('handle tab attached');
  transformRegisteredTabs(async (registeredTabs) => {
    return tabAttachedTransformer(registeredTabs, attachedTabId, attachInfo, getTabInfoId);
  });
};

const handle_tab_activated = async (activeInfo: chrome.tabs.TabActiveInfo) => {
  console.log("handle tab activated");
  transformRegisteredTabs(async (registeredTabs) => {
    return tabActivatedTransformer(registeredTabs, activeInfo);
  });
};

export const setupTabChangeHandlers = () => {
  chrome.tabs.onMoved.addListener(handle_tab_move);
  chrome.tabs.onRemoved.addListener(handle_tab_remove);
  chrome.tabs.onReplaced.addListener(handle_tab_replace);
  chrome.tabs.onUpdated.addListener(handle_tab_update);
  chrome.tabs.onAttached.addListener(handle_tab_attached);
  chrome.tabs.onActivated.addListener(handle_tab_activated);
};