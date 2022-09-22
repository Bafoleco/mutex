import { setId } from './state';
import { setIsInstalledAndRunning } from './firebase';
import path from 'path';
import { BrowserWindow } from 'electron';
import { GlobalState } from './types';

export const setupProtocol = (app: Electron.App, globalState: GlobalState) => {
  // setup protocol handler
  if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient('mutex-turbo', process.execPath, [path.resolve(process.argv[1])]);
    }
  } else {
    app.setAsDefaultProtocolClient('mutex-turbo');
  }

  //configure windows deep linking
  const gotTheLock = app.requestSingleInstanceLock();
  if (!gotTheLock) {
    app.quit()
  } else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      // Someone tried to run a second instance, we should focus our window.
      if (globalState.mainWindow) {
        if (globalState.mainWindow.isMinimized()) globalState.mainWindow.restore()
        globalState.mainWindow.focus()
      }
    })
  }

  // handle protocol
  app.on('open-url', (event, url) => {
    console.log('returned from url: ', url);
    const id = url.split('mutex-turbo://open/id/')[1];
    console.log('parsed id: ', id);
    setId(id);
  });
}