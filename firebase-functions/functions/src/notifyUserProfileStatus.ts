import { config } from 'firebase-functions';
import { document } from 'firebase-functions/lib/providers/firestore';
import { firestore, messaging, initializeApp } from "firebase-admin";

// initializeApp(config().firebase);

export const notifyUserProfileStatus = document('profiles/{userId}')
  .onUpdate(event => {

    const newValue = event.data.data();
    const previousValue = event.data.previous.data();
    console.log("Document updated for user: ", newValue._id);
    console.log('New value:', newValue.isDisabled);
    console.log('Previous value:', previousValue.isDisabled);
    if (newValue !== undefined && (previousValue === undefined || newValue.isDisabled !== previousValue.isDisabled)) {
      console.log('isDisabled Value changed.');
      const ref = firestore().collection('users').doc(newValue._id);
      ref.get().then((snapshot) => {
        const value = snapshot.data();
        console.log('value changes', value);
        console.log('FCM token', value.FcmToken);
        if (value !== undefined && value.FcmToken !== undefined) {
          console.log('Notification sent')
          let message
          if (newValue.isDisabled) {
            message = {
              notification: {
                title: 'Profile Disabled',
                body: 'Hi, Your profile is disabled, Please contact administrator.',
                sound: 'default'
              }
            }
          } else {
            message = {
              notification: {
                title: 'Congratulations!!',
                body: 'Hi, Your profile is accepted, you can search for your partner now. :)',
                sound: 'default'
              }
            }
          }
          messaging().sendToDevice(value.FcmToken, message, {
            priority: 'high',
            timeToLive: 60 * 60 * 24
          }).then(() => {
            console.log('notification message sent to ' + newValue._id);
          });
        }
      });
      return null;
    }
  });
