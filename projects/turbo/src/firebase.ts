import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot } from "firebase/firestore"; 
import { SERVER_URL } from "./constants";
import { getId } from "./state";
import fetch from 'node-fetch';

const TURBO_UPDATE = "turbo-update";

const firebaseConfig = {
  apiKey: "AIzaSyBWKMBNRZJHi1kn71MrrYvHohAjFOnc9-w",
  authDomain: "mutex-remote.firebaseapp.com",
  projectId: "mutex-remote",
  storageBucket: "mutex-remote.appspot.com",
  messagingSenderId: "420886919178",
  appId: "1:420886919178:web:c1a9a8f58dc7e871cd47f3"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const sendStateUpdate = async (stateUpdate: object) => {
  const id = getId();
  console.log("sending state update: " + JSON.stringify(stateUpdate) + " to " + id);
  try {
    await fetch(`${SERVER_URL}/turbo/setState/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({stateUpdate: stateUpdate})
    });  
  } catch (e) {
    console.error(e);
  }
  console.log("after fetch");
}

export const setIsInstalled = async (isInstalled: boolean) => {
  await sendStateUpdate({isInstalled: isInstalled});
}

export const setIsRunning = async (isRunning: boolean) => {  
  console.log("setting isRunning to: ", isRunning);
  await sendStateUpdate({isRunning: isRunning});
}

export const setIsInstalledAndRunning = async () => {
  console.log("setting isInstalled and isRunning to true");
  await sendStateUpdate({isInstalled: true, isRunning: true});
}