import { credential, initializeApp } from "firebase-admin";
import { serviceAccountKey } from "./serviceAccountKey";

initializeApp({
  credential: credential.cert({
    projectId: serviceAccountKey.project_id,
    clientEmail: serviceAccountKey.client_email,
    privateKey: serviceAccountKey.private_key
  }),
  databaseURL: "https://ng-architect.firebaseio.com"
})

export * from './addIdOnCreateProfile';
export * from './thumbnailGenerator';
export * from './indexUserProfile';
// // Start writing Firebase Functions
// // https://firebase.google.com/functions/write-firebase-functions
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
