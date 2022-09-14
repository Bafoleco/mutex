
import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot } from "firebase/firestore"; 
import { RegisteredTabs } from "../../common/types";

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

export const onFirestoreUpdate = (id: string, cb: (arg0: RegisteredTabs) => void) =>
  onSnapshot(doc(db, "tabStates", id), (doc) => {
    console.log("Current firestore data: ", doc.data());
    console.log(doc);
    const data = doc.data();
    if (data) {
      cb(JSON.parse(data.tabState));
    }
});