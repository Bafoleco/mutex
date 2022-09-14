import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";
import {Message, TurboStateUpdate} from "../../common/types";
import * as express from "express";

// Constants
const TURBO_UPDATE = "turbo-update";

// Initialize Firebase
admin.initializeApp();
const db = admin.firestore();

// Setup Express
const app = express();
app.use(express.json());
app.use(cors());

const updateTurboState = async (id: string, newState: TurboStateUpdate) => {
  try {
    await db.collection("turboStates").doc(id).set(newState, {merge: true});
  } catch (error) {
    console.log("Error updating turbo state", error);
    console.error(error);
    throw error;
  }
};

/*
 * Merges the current Mutex Turbo state with the body JSON for a given ID
 */
app.post("/turbo/setState/:id/", async (req, res) => {
  console.log(`route: /turbo/setState/${req.params.id}`);

  const stateUpdate = req.body.stateUpdate;

  console.log(stateUpdate);
  console.log(typeof stateUpdate);

  try {
    await Promise.all([sendMessage(req.params.id,
        {type: TURBO_UPDATE, payload: {stateUpdate: stateUpdate}}),
    updateTurboState(req.params.id, stateUpdate)]);
    res.sendStatus(200);
  } catch (error) {
    console.log("Error updating turbo state", error);
    console.error(error);
    res.sendStatus(500);
  }
});

// Set the FCM registration token for an extension
app.get("/registerExtension/:id/:registrationToken", async (req, res) => {
  console.log("route: /registerExtension/:id/:registrationToken");

  try {
    await db.collection("extensions").doc(req.params.id)
        .set({registrationToken: req.params.registrationToken});
    res.sendStatus(200);
  } catch (error) {
    console.log("Error registering extension", error);
    console.error(error);
    res.sendStatus(500);
  }
});

// Send the message contained in the body to the extension with the given ID
app.post("/sendDataToExtension/:id", async (req, res) => {
  console.log("route: /sendDataToExtension/:id");

  try {
    await sendMessage(req.params.id, req.body.message);
    res.sendStatus(200);
  } catch (error) {
    console.log("Error sending message to extension", error);
    console.error(error);
    res.sendStatus(500);
  }
});

// Update the tab state for a particular id
app.post("/sendDataToRemote/:id", async (req, res) => {
  console.log("route: /sendDataToRemote/:id");

  try {
    await db.collection("tabStates").doc(req.params.id)
        .set({tabState: JSON.stringify(req.body.message.payload)});
    res.sendStatus(200);
  } catch (error) {
    console.log("Error sending data to remote", error);
    console.error(error);
    res.sendStatus(500);
  }
});

// Send a message to the extension with the given ID
const sendMessage = async (id: string, message: Message) => {
  let registrationToken;
  try {
    const doc = await db.collection("extensions").doc(id).get();
    console.log(doc.exists);
    console.log(doc.data());
    if (doc.exists) {
      const data = doc.data();
      if (data) {
        registrationToken = data.registrationToken;
      }
    } else {
      throw new Error("Extension not found");
    }
  } catch (error) {
    console.log("Error getting registration token", error);
    console.error(error);
    throw error;
  }

  const options = {
    priority: "high",
    timeToLive: 0,
  };

  const payload = {
    data: {
      message: JSON.stringify(message),
    },
  };

  admin.messaging().sendToDevice(registrationToken, payload, options);
};

exports.api = functions.https.onRequest(app);

app.post("/uploadTabImages/:id", async (req, res) => {

  const tabImages = req.body.tabImages;
  db.collection("tabImages").doc(req.params.id).set(tabImages);
});