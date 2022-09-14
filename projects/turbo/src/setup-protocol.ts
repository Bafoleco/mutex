import { getId, setId } from './state';
import { setIsInstalledAndRunning } from './firebase';
import path from 'path';
import { BrowserWindow } from 'electron';

//TODO main window edge case
export const setupProtocol = (app: Electron.App, mainWindow: BrowserWindow) => {
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
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
      }
    })
  }
  
  app.on('open-url', (event, url) => {
    console.log('returned from url: ', url);
    const id = url.split('mutex-turbo://')[1];
    setId(id);
    setIsInstalledAndRunning();
  });
}