import { BrowserWindow } from "electron";

export type GlobalState = {
  mainWindow: BrowserWindow | null;
  windowWidth: number;
}
