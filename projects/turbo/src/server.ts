import express from "express";
import { keyboard } from "@nut-tree/nut-js";
import { BrowserWindow } from "electron";
import { setId } from "./state";
import { setIsInstalledAndRunning } from "./firebase";
import { GlobalState } from "./types";
import * as http from 'http';

const expressApp = express()
const port = 34561;
let server: http.Server = null;

const firebaseConfig = {
  apiKey: "AIzaSyBWKMBNRZJHi1kn71MrrYvHohAjFOnc9-w",
  authDomain: "mutex-remote.firebaseapp.com",
  projectId: "mutex-remote",
  storageBucket: "mutex-remote.appspot.com",
  messagingSenderId: "420886919178",
  appId: "1:420886919178:web:c1a9a8f58dc7e871cd47f3"
};

export const shutdownServer = () => {
  console.log("Shutting down server");
  if (server) {
    server.close();
  }
}

export const setupServer = (globalState: GlobalState) => {
  console.log("Setting up server");

  keyboard.config.autoDelayMs = 0;

  expressApp.get('/heartbeat/:id', async (req, res) => {
    console.log("Heartbeat received");
    if (globalState.mainWindow) {
      await globalState.mainWindow.webContents.send('heartbeat', { timestamp: Date.now(), id: req.params.id });
    }
    console.log("setting id to: ", req.params.id);
    setId(req.params.id);
    res.sendStatus(200);
  });

  expressApp.get('/triggerFullscreen', async (req, res) => {
    console.log("typed x");
    await keyboard.type("x");
    res.sendStatus(200);
  });

  server = expressApp.listen(port, () => {
    console.log(`Mutex Local listening on port ${port}`)
  });
}
