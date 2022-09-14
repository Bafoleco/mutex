import { REGISTERED_TABS } from "../../../common/constants";
import { RegisteredTabs, WindowState } from "../../../common/types";
import {getLocal, getTabInfo, setLocal, getChromeTabPromise} from "../shared/util";

const handle_tab_move = (tabId: number, moveInfo: chrome.tabs.TabMoveInfo) => {
    const windowId = moveInfo.windowId;
    getLocal(REGISTERED_TABS, (oldRegisteredTabs: RegisteredTabs) => {
      const newRegisteredTabs = {...oldRegisteredTabs};
      
      const newWindowInfo: WindowState = {};
      const oldWindowInfo: WindowState = oldRegisteredTabs[windowId];
  
      const promises = Object.keys(oldWindowInfo).map((tabId) => {
        return getChromeTabPromise(parseInt(tabId));
      });
  
      Promise.all(promises).then((tabs) => {
        tabs.forEach((tab) => {
          if (tab.id) {
            newWindowInfo[tab.id] = getTabInfo(tab);
          } else {
            console.log('tab id not found');
          }
        });
      }).then(() => {
        newRegisteredTabs[windowId] = newWindowInfo;
        setLocal(REGISTERED_TABS, newRegisteredTabs);  
      });
    });
};
  
const handle_tab_remove = (tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) => {
    const windowId = removeInfo.windowId;
  
    getLocal(REGISTERED_TABS, (oldRegisteredTabs: RegisteredTabs) => {
      const newRegisteredTabs = {...oldRegisteredTabs};
      const newWindowInfo = {...oldRegisteredTabs[windowId]};
  
      delete newWindowInfo[tabId];
      if(Object.keys(newWindowInfo).length > 0) {
        newRegisteredTabs[windowId] = newWindowInfo;
      } else {
        delete newRegisteredTabs[windowId];
      }
  
      setLocal(REGISTERED_TABS, newRegisteredTabs);  
    });
};
  
const handle_tab_update = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
    getLocal(REGISTERED_TABS, (oldRegisteredTabs) => {
      const windowId = tab.windowId;
      if(windowId in oldRegisteredTabs && tabId in oldRegisteredTabs[windowId]) {
        const newRegisteredTabs = {...oldRegisteredTabs};
        const newWindowInfo = {...oldRegisteredTabs[windowId]};
    
        newWindowInfo[tabId] = getTabInfo(tab);
        newRegisteredTabs[windowId] = newWindowInfo; 
    
        setLocal(REGISTERED_TABS, newRegisteredTabs);    
      }
    });
};
  
const handle_tab_replace = (addedTabId: number, removedTabId: number) => {
    console.log('tab replace triggered?');
};

//TODO test
const handle_tab_attached = (attachedTabId: number, attachInfo: chrome.tabs.TabAttachInfo) => {
    console.log('tab attached');
    const newWindowId = attachInfo.newWindowId; 
    getLocal(REGISTERED_TABS, (oldRegisteredTabs) => {
        let wasFound = false;
        Object.keys(oldRegisteredTabs).forEach((windowId) => {
            Object.keys(oldRegisteredTabs[windowId]).forEach((tabId) => {
                if(attachedTabId === parseInt(tabId)) {
                    delete oldRegisteredTabs[windowId][tabId]
                    if (Object.keys(oldRegisteredTabs[windowId]).length == 0) {
                        delete oldRegisteredTabs[windowId];
                    }
                    wasFound = true;
                }
            });
        });

        if(wasFound) {
            chrome.tabs.get(attachedTabId, (tab) => {
                const newRegisteredTabs = {...oldRegisteredTabs};
                if(!(newWindowId in newRegisteredTabs)) {
                    newRegisteredTabs[newWindowId] = {};
                }
                newRegisteredTabs[newWindowId][attachedTabId] = getTabInfo(tab);
                console.log('registered tabs after ATTACH');
                console.log(newRegisteredTabs);
                setLocal(REGISTERED_TABS, newRegisteredTabs);
            });
        }
    });
};

export const setupTabChangeHandlers = () => {
    chrome.tabs.onMoved.addListener(handle_tab_move);
    chrome.tabs.onRemoved.addListener(handle_tab_remove);
    chrome.tabs.onReplaced.addListener(handle_tab_replace);
    chrome.tabs.onUpdated.addListener(handle_tab_update);    
    chrome.tabs.onAttached.addListener(handle_tab_attached);
};