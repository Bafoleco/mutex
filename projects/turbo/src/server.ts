import express from "express";
import { mouse, screen, Button, Point, getActiveWindow, getWindows, keyboard } from "@nut-tree/nut-js";
import { BrowserWindow } from "electron";
import { setId } from "./state";
import { setIsInstalledAndRunning } from "./firebase";

const server = express()
const port = 34561;

const firebaseConfig = {
  apiKey: "AIzaSyBWKMBNRZJHi1kn71MrrYvHohAjFOnc9-w",
  authDomain: "mutex-remote.firebaseapp.com",
  projectId: "mutex-remote",
  storageBucket: "mutex-remote.appspot.com",
  messagingSenderId: "420886919178",
  appId: "1:420886919178:web:c1a9a8f58dc7e871cd47f3"
};

export const setupServer = (window: BrowserWindow) => {
  console.log("Setting up server");

  keyboard.config.autoDelayMs = 0;

  server.get('/heartbeat/:id', async (req, res) => {
    await window.webContents.send('heartbeat', {timestamp: Date.now(), id: req.params.id});
    console.log("setting id to: ", req.params.id);
    setId(req.params.id);
    setIsInstalledAndRunning();
    res.send('ack');
  });

  server.get('/triggerFullscreen', async (req, res) => {
    
      // console.log(await screen.height());
      // console.log(await screen.width());
    
      // const [width, height] = await Promise.all([screen.width(), screen.height()]);
      // const mousePos = await mouse.getPosition();
    
      // await mouse.setPosition(new Point(width / 2, height / 2));
      // await mouse.click(Button.LEFT);
      // await mouse.setPosition(mousePos);
      // await window.webContents.send('heartbeat', {timestamp: Date.now()})

      console.log("typed x");
      await keyboard.type("x");

      res.sendStatus(200);
    });
        
    server.listen(port, () => {
      console.log(`Mutex Local listening on port ${port}`)
    });
}

