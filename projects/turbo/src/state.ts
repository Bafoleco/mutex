import Store from 'electron-store';
import { ipcMain } from 'electron';
import { REC_ID_EVENT, REQ_ID_EVENT, SET_ID_EVENT } from './constants';
import { setIsInstalledAndRunning } from './firebase';
import { contains } from '@firebase/util';

const ID_STORAGE_KEY = "id";

const store = new Store();
console.log("setting up state management");

let id: string = (store.has(ID_STORAGE_KEY)) ? (store.get(ID_STORAGE_KEY) as string) : null;

// Setup state for renderer
ipcMain.on(REQ_ID_EVENT, (event, message) => {
    console.log("requestId event got");
    console.log("REQ_ID_EVENT");
    event.sender.send(REC_ID_EVENT, id);
});

ipcMain.on(SET_ID_EVENT, (event, message) => {
    setId(message.id);
});

export const setId = (newId: string) => {
    if (id !== newId) {
        id = newId;
        store.set(ID_STORAGE_KEY, id);
    }
}

export const getId = () => {
    return id;
}
