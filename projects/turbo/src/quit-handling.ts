import { setIsRunning } from "./firebase";

export const setupQuitHandling = (app: Electron.App) => {

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', async () => {
    console.log("window-all-closed");
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  // Alert the server that Mutex Turbo is no longer running
  // on quit. Then actually quit.
  let quitOnce: boolean = false;
  app.on('before-quit', async (event) => {
    console.log("before-quit");
    if (!quitOnce) {
      event.preventDefault();
      await setIsRunning(false);
      quitOnce = true;
      app.quit();
    }
  });
}