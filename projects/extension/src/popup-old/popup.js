import bootstrap from 'bootstrap'
import { getLocal, setClipboard, registerTab, deregisterTab, setLocal} from "../shared/util.js";
import { FULL_PERMISSIONS, MUTEX_TURBO_URI, REGISTERED_TABS, REMOTE_URL, TURBO_STATE } from "../../../common/constants";
import { turboTimerHandler, setTurboHasPermissions, setTurboIsRunning, setTurboIsInstalled } from '../background/turbo.js';

const tabToggle = document.getElementById('toggle');
const pairInfo = document.getElementById('pair-info');
const registerContainer = document.getElementById('register-tab-container');
const enableScripting = document.getElementById('scripting');
const showPairInfo = document.getElementById('show-pair-info');
const qrDiv = document.getElementById("qr-div");
const copyLinkBtn = document.getElementById("copy-link-btn");
const turboIcon = document.getElementById('turbo-icon');
const turboDiv = document.getElementById('main-stack');

//listen for mutex turbo state
chrome.storage.onChanged.addListener((changes) => {
    for (const storageKey in changes) {
      if (storageKey == TURBO_STATE) {
        const turboState = changes[storageKey].newValue;
        handleTurboState(turboState);
      }
    }
});

getLocal(TURBO_STATE, (turboState) => {
    handleTurboState(turboState);
});

const createBootstrapButton = (text, isLink) => {
    const button = (!isLink) ? document.createElement("button") : document.createElement("a");
    button.classList.add("btn");
    button.classList.add("btn-outline-primary");
    if (isLink) {
        button.role = "button";
    } else {
        button.type = "button";
    }
    button.style.width = "100%";
    button.innerHTML = text;
    return button;
}
  
const createEnableTurboButton = () => {
    const enableTurboButton = createBootstrapButton("Enable Mutex Turbo");
    const reqsForScriptInjection = {
        origins: ["<all_urls>"],
        permissions: ["scripting"]
    }
    
    enableTurboButton.onclick = () => {
        console.log("enable scripting");
        // handle changes on backend
        chrome.permissions.request(reqsForScriptInjection);
        turboTimerHandler();
    }
    return enableTurboButton;
}

const createInstallTurboElement = () => {
    const installTurboElement = document.createElement("div");
    installTurboElement.classList.add("hstack");
    installTurboElement.classList.add("gap-1");

    const installTurboButton = createBootstrapButton("Install Mutex Turbo");
    installTurboButton.onclick = () => {
        //open link to mutex remote
        chrome.tabs.create({url: `${REMOTE_URL}/info`});
    }

    const installConfirmButton = createBootstrapButton("I've Installed Mutex Turbo");
    installConfirmButton.onclick = () => {
        setTurboIsInstalled(true);
    }

    installTurboElement.appendChild(installTurboButton);
    installTurboElement.appendChild(installConfirmButton);
    return installTurboElement;
}

const createOpenTurboButton = () => {
    const openTurboButton = createBootstrapButton("Open Mutex Turbo");

    openTurboButton.onclick = () => {
        chrome.tabs.create({url: `${MUTEX_TURBO_URI}/open`});
    }
    
    return openTurboButton;
}

const enableTurboButton = createEnableTurboButton();
const installTurboElement = createInstallTurboElement();
const openTurboButton = createOpenTurboButton();
let currentElement = null;
const handleTurboState = (turboState) => {
    console.log("handle turbo state");
    if (currentElement) {
        console.log("remove current element");
        console.log(currentElement);
        turboDiv.removeChild(currentElement);
        currentElement = null;
    }
    console.log(turboState);
    if (!turboState.hasPermissions) {
        console.log("does not have permissions");
        currentElement = turboDiv.appendChild(enableTurboButton);
        turboIcon.style.display = "none";
    } else if (turboState.hasPermissions && !turboState.isInstalled) {
        console.log("has permissions but not installed");
        currentElement = turboDiv.appendChild(installTurboElement);
        turboIcon.style.display = "none";
    } else if (turboState.isInstalled && !turboState.isRunning) {
        console.log("has permissions and is installed but not running");
        currentElement = turboDiv.appendChild(openTurboButton);
        turboIcon.style.display = "none";
    } else {
        console.log("has permissions and is installed and running");
        turboIcon.style.display = "";
    }
}

let idText = "";
getLocal("id", (id) => {
    console.log("got ID: " + id)
    new QRCode(qrDiv, 
        {
            text: `${REMOTE_URL}/remote/${id}`,
            width: 256,
            height: 256,
        });
    idText = id;
});

copyLinkBtn.onclick = () => {
    setClipboard(`${REMOTE_URL}/remote/${idText}`);
}

showPairInfo.onclick = () => {
    if (pairInfo.style.display === "none") {
        pairInfo.style.display = ""; 
        showPairInfo.innerHTML = "Hide Pairing Info";
    } else {   
        pairInfo.style.display = "none";
        showPairInfo.innerHTML = "Show Pairing Info";
    }
}

getLocal(REGISTERED_TABS, (oldRegisteredTabs) => {
    chrome.tabs.query({active: true, currentWindow: true}, (matches) => {
        const currentTab = matches[0];
        const windowId = currentTab.windowId; 
        const tabId = currentTab.id
        
        console.log(currentTab);
        console.log("current tab id: " + tabId);
        
        if(windowId in oldRegisteredTabs && tabId in oldRegisteredTabs[windowId]) {
            setupRegisteredState();
        } else {
            setupUnregisteredState();
        }
        registerContainer.style.visibility = "";
    });
}); 

const setupRegisteredState = () => {
    tabToggle.onclick = () => {
        //disable button
        tabToggle.disabled = true;
        //deregister tab for use with Mutex
        chrome.tabs.query({active: true, currentWindow: true}, (matches) => {
            const currentTab = matches[0];
            deregisterTab(currentTab, (newRegisteredTabs) => {
                console.log('new tabs');
                console.log(newRegisteredTabs);
                setupUnregisteredState();
                //reenable button
                tabToggle.disabled = false;
            });
        });     
    }

    tabToggle.innerHTML = "Deregister Tab";
    tabToggle.classList.add("btn-danger");
    tabToggle.classList.remove("btn-success");
}

const setupUnregisteredState = () => {
    tabToggle.onclick = () => {
        //disable button
        tabToggle.disabled = true;
        //register tab for use with Mutex
        chrome.tabs.query({active: true, currentWindow: true}, (matches) => {
            const currentTab = matches[0];
            registerTab(currentTab, (newRegisteredTabs) => {
                console.log('new tabs');
                console.log(newRegisteredTabs);
                setupRegisteredState();
                //reenable button
                tabToggle.disabled = false;
            })
        });
    }

    tabToggle.innerHTML = "Register Tab";
    tabToggle.classList.add("btn-success");
    tabToggle.classList.remove("btn-danger");
}
