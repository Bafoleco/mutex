import { AUDIBLE_TAB, REGISTERED_TABS, VISIBLE_TABS } from "./constants";
import { RegisteredTabs, TabInfo } from "../../../common/types";
import AwaitLock from 'await-lock';
import { switchAudibleTab } from "../background/active_tab_switching";

export const setLocal = (key: string, value: any, callback?: () => void) => {
  const set_data: { [key: string]: any } = {};
  set_data[key] = value;
  chrome.storage.local.set(set_data, callback);
}

export const setLocalAsync = (key: string, value: any) => {
  const set_data: { [key: string]: any } = {};
  set_data[key] = value;
  return chrome.storage.local.set(set_data);
}

export const getLocal = (key: string, callback: (arg0: any) => void) => {
  chrome.storage.local.get(key, (wrapped) => {
    if (callback != null) {
      callback(wrapped[key])
    }
  });
}

export const getLocalAsync = async (key: string) => {
  const wrapped = await chrome.storage.local.get(key);
  return wrapped[key];
}

export const mergeLocal = (key: string, valueUpdate: any, callback?: () => void) => {
  getLocal(key, (value) => {
    const newValue = { ...value }

    console.log(value)
    console.log(valueUpdate)
    for (const key in valueUpdate) {
      newValue[key] = valueUpdate[key];
    }
    console.log(newValue);
    setLocal(key, newValue, callback);
  });
}

export const getTabInfo = (tab: chrome.tabs.Tab): TabInfo => {
  return {
    index: tab.index,
    title: tab.title,
    icon: tab.favIconUrl,
    status: tab.status,
    url: tab.url,
    pendingUrl: tab.pendingUrl,
    active: tab.active,
    muted: tab.mutedInfo?.muted,
  }
}

export const setClipboard = (text: string) => {
  var type = "text/plain";
  var blob = new Blob([text], { type });
  var data = [new ClipboardItem({ [type]: blob })];

  navigator.clipboard.write(data);
}

export const registerTabTransformer = (registeredTabs: RegisteredTabs, tab: chrome.tabs.Tab) => {
  const windowId = tab.windowId;
  const tabId = tab.id;

  if (tabId) {
    const newRegisteredTabs = { ...registeredTabs }
    if (!(windowId in registeredTabs)) {
      newRegisteredTabs[windowId] = {};
    }
    newRegisteredTabs[windowId][tabId] = getTabInfo(tab);
    return newRegisteredTabs;
  } else {
    console.log("tabId is undefined, not registering tab");
    return registeredTabs;
  }
}

export const registerTab = async (tab: chrome.tabs.Tab) => {
  console.log("registering tab: " + tab.id);

  const oldAudibleTab = await getLocalAsync(AUDIBLE_TAB);

  console.log("old audible tab: " + oldAudibleTab);

  await switchAudibleTab(tab.id, oldAudibleTab);

  await transformRegisteredTabs(async (registeredTabs) => {
    return registerTabTransformer(registeredTabs, tab);
  });

  setLocal(AUDIBLE_TAB, tab.id, () => {
    console.log("set audible tab to: " + tab.id);
  });
};

export const deregisterTabTransformer = (registeredTabs: RegisteredTabs, tab: chrome.tabs.Tab) => {
  const tabId = tab.id;
  if (tabId) {
    const windowId = tab.windowId;
    const newRegisteredTabs = { ...registeredTabs }
    delete newRegisteredTabs[windowId][tabId];
    if (Object.keys(newRegisteredTabs[windowId]).length === 0) {
      delete newRegisteredTabs[windowId];
    }
    return newRegisteredTabs;
  } else {
    console.log("tabId is undefined, not deregistering tab");
    return registeredTabs;
  }
}

export const deregisterTab = async (tab: chrome.tabs.Tab) => {
  console.log("deregistering tab: " + tab.id);
  const tabId = tab.id;
  await transformRegisteredTabs(async (registeredTabs) => {
    return deregisterTabTransformer(registeredTabs, tab);
  });

  // TODO this is not correct, we should only reset audible tab if this tab was the audible tab
  setLocal(AUDIBLE_TAB, undefined, () => {
    console.log("set audible tab to: " + tabId);
  });
};

export const getNumTabs = (obj: RegisteredTabs) => {
  let count = 0;
  for (const windowKey in obj) {
    const window = obj[windowKey];
    for (const tab in window) {
      count += 1;
    }
  }
  return count;
}

// atomically transform the registered tabs using a provided transformer functiond 
// and stores the results.
let registeredTabsLock = new AwaitLock();
export const transformRegisteredTabs = async (transformer: (arg0: RegisteredTabs) => Promise<RegisteredTabs>) => {
  await registeredTabsLock.acquireAsync();
  try {
    console.log("acquired lock");
    const registeredTabs = await getLocalAsync(REGISTERED_TABS);
    const newRegisteredTabs = await transformer(registeredTabs);
    await setLocalAsync(REGISTERED_TABS, newRegisteredTabs);
  } finally {
    console.log("releasing lock");
    registeredTabsLock.release();
  }
}