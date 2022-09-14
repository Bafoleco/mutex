// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';
import { IElectronAPI } from './types';
import { HEARTBEAT_EVENT, REC_ID_EVENT, REQ_ID_EVENT, SET_ID_EVENT } from '../constants';

console.log('preload.ts');

const setHeartbeatHandler = (heartbeatHandler: (event: Event, message: any) => void): void => {
    ipcRenderer.on(HEARTBEAT_EVENT, heartbeatHandler);
};

const setIdHandler = (idHandler: (event: Event, message: any) => void): void => {
    ipcRenderer.on(REC_ID_EVENT, idHandler);
}

const api: IElectronAPI = {
    setHeartbeatHandler: setHeartbeatHandler,
    setIdHandler: setIdHandler,
    requestId: () =>  { 
        ipcRenderer.send(REQ_ID_EVENT);
        console.log("requestId from frontend");
    },
    setId: (id: string) => ipcRenderer.emit(SET_ID_EVENT, { id: id }),
};

contextBridge.exposeInMainWorld('electronAPI', api);