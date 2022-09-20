//storage constants

export const REGISTERED_TABS: string = "registeredTabs";
export const AUDIBLE_TAB: string = "audibleTab";
export const VISIBLE_TABS: string = "visibleTabs";
export const FULLSCREEN_INFO: string = "fullscreen-info/";
export const FULL_PERMISSIONS: string = "full-permissions";
export const TURBO_STATE: string = "turboState";

export const ID: string = "id";
export const TYPE: string = "type";

export const CONTEXT_MENU_ID: string = "1";

//server message types
export const REQUEST_UPDATE: string = "request-update";
export const LISTEN_CHROME: string = "listen-chrome";
export const REGISTERED_TAB_UPDATE: string = "registered-tabs-update";
export const ACTIVE_TABS_UPDATE: string = "active-tabs-update";
export const TURBO_UPDATE: string = "turbo-update";
export const PAUSE_UPDATE: string = "pause-update";
export const WINDOW_FOCUS_UPDATE: string = "window-focus-update";

//Remote communication
export const SERVER_URL: string = "https://us-central1-mutex-remote.cloudfunctions.net/api";
export const REMOTE_URL: string = "https://mutex-remote.web.app";
// export const REMOTE_URL = "http://localhost:3001";
export const MUTEX_TURBO_URI: string = "mutex-turbo://";
export const CLOUD_MESSAGING_SENDER_ID: string = "420886919178";

//Mutex Turbo and Fullscreen Handling
const MUTEX_TURBO_PORT = 34561;
export const MUTEX_TURBO_API: string = "http://localhost:" + MUTEX_TURBO_PORT;
export const MUTEX_TURBO_PERMISSION_REQS = {
  origins: ["<all_urls>"],
  permissions: ["scripting"]
}
export const MUTEX_TURBO_PING_ALARM: string = "mutex-turbo-ping";

//RGB = (3,4,7)
export const FULLSCREEN_BUTTON_COLOR: string = "#030407";

//Storage
export const TAB_IMAGES_BUCKET: string = "tab-images";