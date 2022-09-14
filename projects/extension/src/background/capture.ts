import { RegisteredTabs } from "../../../common/types";
import { REGISTERED_TABS } from "../shared/constants";
import { getLocalAsync, getNumTabs, registerTab } from "../shared/util";
import { Storage } from '@google-cloud/storage';
import { TAB_IMAGES_BUCKET } from "../../../common/constants";

const CAPTURE_PERMISSIONS = {
  origins: ["<all_urls>"],
}


const shouldCaptureTabs = async (registeredTabs: RegisteredTabs) => {


  // const hasCapturePermissions = await chrome.permissions.contains(CAPTURE_PERMISSIONS); 


  if (getNumTabs(registeredTabs) > 0) {
    return true;
  } else {
    return false;
  }
}

const captureTab = (windowId: number) => {
  chrome.tabs.captureVisibleTab(windowId, (dataUrl) => {
    console.log("captured tab");
    console.log(dataUrl);
  });
}

const storage = new Storage();


const captureTabs = async () => {
  const registeredTabs = await getLocalAsync(REGISTERED_TABS);


  const options = {

  }

  // await storage.bucket(TAB_IMAGES_BUCKET).upload()

  for (const windowId in registeredTabs) {
    for (const tabId in registeredTabs[windowId]) {

    }
  }
}