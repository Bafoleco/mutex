export interface IElectronAPI {
  setHeartbeatHandler: (heartbeatHandler: (event: Event, message: any) => void) => void;
  setIdHandler: (idHandler: (event: Event, message: any) => void) => void;
  requestId: () => void;
  setId: (id: string) => void;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}