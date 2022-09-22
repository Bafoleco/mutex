import Store from 'electron-store';
import { ipcMain } from 'electron';
import { REC_ID_EVENT, REQ_ID_EVENT, SET_ID_EVENT } from './constants';
import { setIsInstalledAndRunning } from './firebase';
import { ID_STORAGE_KEY } from './constants';

const store = new Store();

let id: string = (store.has(ID_STORAGE_KEY)) ? (store.get(ID_STORAGE_KEY) as string) : null;

// there are two cases, either the frontend loads before we have an id, or it loads after we have an id.
// in the first case, we can report that we are running as soon as we get the id. 
// in the second case, we need to wait for the frontend to load before we can report that we are running.

// Setup state for renderer
let frontendLoaded = false;
ipcMain.on(REQ_ID_EVENT, (event, message) => {
  console.log("handling REQ_ID_EVENT event");
  frontendLoaded = true;
  // we have an id and are fully loaded, so we can report that we are running
  if (id) {
    setIsInstalledAndRunning();
  }
  event.sender.send(REC_ID_EVENT, id);
});

ipcMain.on(SET_ID_EVENT, (event, message) => {
  console.log("handling SET_ID_EVENT event");
  setId(message.id);
});

export const setId = (newId: string) => {
  if (id !== newId) {
    id = newId;
    store.set(ID_STORAGE_KEY, id);
    // we have an id and are fully loaded, so we can report that we are running
    if (frontendLoaded) {
      setIsInstalledAndRunning();
    }
  }
}

export const getId = () => {
  return id;
}
