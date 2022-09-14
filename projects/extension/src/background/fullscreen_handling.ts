import { MUTEX_TURBO_API, FULLSCREEN_INFO } from "../../../common/constants";
import { getLocal, getLocalAsync, setLocal } from "../shared/util";

const createRestoreFullscreenStateButton = () => {
  const elem = document.fullscreenElement;
  if (elem) {
    console.log("add keydownListener");

    const keydownListener = function (event: KeyboardEvent) {
      if (event.key === "x") {
        console.log("x pressed");
        document.removeEventListener("keydown", keydownListener);

        const hostname = window.location.hostname;

        if (hostname === "tv.youtube.com") {
          console.log("youtube tv custom logic");
          const fsButton = document.querySelector('[aria-label="Full screen (f)"]');
          elem.requestFullscreen().then(() => {
            (fsButton as HTMLButtonElement).click();
          });
        } else {
          elem.requestFullscreen();
        }
      }
    };

    document.addEventListener("keydown", keydownListener);

    return true;
  }
  return false;
}

export const storeFullscreenState = async (tabId: number, cb?: () => void) => {
  console.log("store fullscreen state for taLId: " + tabId);
  try {
    const res = await chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: createRestoreFullscreenStateButton,
    });
    const isFullscreen = res[0].result;
    setLocal(FULLSCREEN_INFO + tabId, isFullscreen, cb);
  } catch (e) {
    console.log("error storing fullscreen status");
    console.error(e);
    setLocal(FULLSCREEN_INFO + tabId, false, cb);
  }
}

// const youtubeFullscreen = (tabId) => {
//   const vids = document.getElementsByTagName('video');
//   const vid = vids[0];
//   console.log("about to request fullscreen");
//   console.trace();
//   vid.requestFullscreen();
// }

// export const goFullcreenYoutube = (tabId) => {
//   chrome.scripting.executeScript({
//     target: {tabId: tabId},
//     func: youtubeFullscreen,
//   }), (res) => {
//     console.log(res);
//   }
// }

export const restoreFullscreenState = async (tabId: number, windowId: number) => {
  const start = performance.now();
  const tabWasFullscreen = await getLocalAsync(FULLSCREEN_INFO + tabId);
  if (tabWasFullscreen) {
    console.log(windowId);
    await fetch(MUTEX_TURBO_API + "/triggerFullscreen");
  }
  const end = performance.now();
  console.log("restoreFullscreenState took " + (end - start) + "ms");
}
