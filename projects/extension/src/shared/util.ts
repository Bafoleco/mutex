import { AUDIBLE_TAB, REGISTERED_TABS, VISIBLE_TABS } from "./constants";
import { RegisteredTabs, TabInfo } from "../../../common/types";

export const setLocal = (key: string, value: any, callback?: () => void) => {
  const set_data: { [key: string]: any } = {};
  set_data[key] = value;
  chrome.storage.local.set(set_data, callback);
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
  }
}

export const getChromeTabPromise = (tabId: number): Promise<chrome.tabs.Tab> => {
  return new Promise((resolve, reject) => {
    chrome.tabs.get(tabId, (tab) => {
      resolve(tab);
    });
  });
}

export const setClipboard = (text: string) => {
  var type = "text/plain";
  var blob = new Blob([text], { type });
  var data = [new ClipboardItem({ [type]: blob })];

  navigator.clipboard.write(data);
}

export const registerTab = (tab: chrome.tabs.Tab, callback: () => void) => {
  const tabId = tab.id;
  if (tabId) {
    getLocal(REGISTERED_TABS, (oldRegisteredTabs: RegisteredTabs) => {
      const windowId = tab.windowId;

      //set current tab to be audible
      setLocal(AUDIBLE_TAB, tabId, () => {
        console.log("set audible tab to: " + tabId);
      });

      //update registered tabs map
      const newRegisteredTabs = { ...oldRegisteredTabs }
      if (!(windowId in oldRegisteredTabs)) {
        newRegisteredTabs[windowId] = {};
      }
      newRegisteredTabs[windowId][tabId] = getTabInfo(tab);
      setLocal(REGISTERED_TABS, newRegisteredTabs, callback);
    });
  } else {
    console.log("tabId is undefined, not registering tab");
  }
};

export const deregisterTab = (tab: chrome.tabs.Tab, callback: () => void) => {
  const tabId = tab.id;
  if (tabId) {
    getLocal(REGISTERED_TABS, (oldRegisteredTabs) => {
      const windowId = tab.windowId;

      //set current tab to be audible
      setLocal(AUDIBLE_TAB, undefined, () => {
        console.log("set audible tab to: " + tabId);
      });

      //update registered tabs map
      const newRegisteredTabs = { ...oldRegisteredTabs }
      delete newRegisteredTabs[windowId][tabId];
      if (Object.keys(newRegisteredTabs[windowId]).length === 0) {
        delete newRegisteredTabs[windowId];
      }

      setLocal(REGISTERED_TABS, newRegisteredTabs, callback);
    });
  } else {
    console.log("tabId is undefined, not deregistering tab");
  }
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