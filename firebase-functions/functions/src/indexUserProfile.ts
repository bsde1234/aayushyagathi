import { firestore, Event } from 'firebase-functions';
import { messaging, firestore as fStore } from "firebase-admin";

const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
  host: 'user:MusUYRQD8KNw@130.211.232.170:9200',
  log: 'trace'
});

function NotifyUserProfile(event) {

  const newValue = event.data.data();
  const previousValue = event.data.previous.data();
  console.log("Document updated for user: ", newValue._id);
  console.log('New value:', newValue.isDisabled);
  console.log('Previous value:', previousValue.isDisabled);
  if (newValue !== undefined && (previousValue === undefined || newValue.isDisabled !== previousValue.isDisabled)) {
    console.log('isDisabled Value changed.');
    const ref = fStore().collection('users').doc(newValue._id);
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
}

export const AddUserProfileIndex = firestore.document('profiles/{userID}').onCreate(event => {
  return new Promise((resolve, reject) => {
    client.index({
      index: 'profiles',
      type: 'doc',
      id: event.params.userID,
      body: event.data.data()
    }, (err, response) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log('Indexed new profile', event.params.userID);
        resolve(response);
      }
    });
  })
});

export const UpdateUserProfileIndex = firestore.document('profiles/{userID}').onUpdate(event => {
  NotifyUserProfile(event);
  return new Promise((resolve, reject) => {
    client.index({
      index: 'profiles',
      type: 'doc',
      id: event.params.userID,
      body: {
        doc: event.data.data()
      }
    }, (err, response) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log('Profile Updated for', event.params.userID);
        resolve(response)
      }
    });
  })
});

export const DeleteUserProfileIndex = firestore.document('profiles/{userID}').onDelete(event => {
  return new Promise((resolve, reject) => {
    client.delete({
      index: 'profiles',
      type: 'doc',
      id: event.params.userID
    }, function (error, response) {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        console.log('Profile deleted for: ', event.params.userID);
        resolve(response)
      }
    });
  })
});