const functions = require('firebase-functions');
const sharp = require('sharp')
const _ = require('lodash');
const path = require('path');
const os = require('os');
import { unlinkSync } from "fs";
import { firestore, storage } from "firebase-admin";

export const generatePhotoThumbnail3 = functions.storage.object('profile_photos/{profile_Id}').onChange(event => {

  const object = event.data; // The Storage object.

  console.log(object)

  const fileBucket = object.bucket; // The Storage bucket that contains the file.
  const filePath = object.name; // File path in the bucket.
  const contentType = object.contentType; // File content type.
  const resourceState = object.resourceState; // The resourceState is 'exists' or 'not_exists' (for file/folder deletions).
  const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.
  const file = storage().bucket(fileBucket).file(filePath);
  const size = 64; // Resize target width in pixels

  if (!contentType.startsWith('image/') || resourceState === 'not_exists') {
    console.log('This is not an image.');
    return null;
  }

  if (_.includes(filePath, '_thumb')) {
    console.log('already processed image');
    return null;
  }


  const fileName = filePath.split('/').pop();
  const bucket = storage().bucket(fileBucket);
  const tempFilePath = path.join(os.tmpdir(), fileName);

  return bucket.file(filePath).download({
    destination: tempFilePath
  }).then(() => {

    const newFileName = `${fileName}_${size}_thumb.png`
    const newFileTemp = path.join(os.tmpdir(), newFileName);
    const newFilePath = `thumbs/${newFileName}`

    sharp(tempFilePath)
      .resize(size, null)
      .toFile(newFileTemp, (err, info) => {
        bucket.upload(newFileTemp, {
          destination: newFilePath
        }).then((e) => {
          console.log(e)
          console.log('Removing temp files');
          unlinkSync(newFileTemp);
          unlinkSync(tempFilePath);
          const config = {
            action: 'read',
            expires: '03-17-2025'
          }
          return Promise.all([
            e[0].getSignedUrl(config),
            file.getSignedUrl(config)
          ])
        }).then((results) => {
          const thumbResult = results[0];
          const originalResult = results[1];
          const thumbFileUrl = thumbResult[0];
          const fileUrl = originalResult[0];
          const _id = event.params.profile_Id;
          const fName = fileName.toString().substring(0, fileName.length - 4);
          console.log('Updating user:', fileName, fName)
          return firestore()
            .collection('profiles')
            .doc(fName)
            .update({
              thumbUrl: thumbFileUrl,
              photo: fileUrl
            }).then(res => {
              console.log('updated profile')
              console.log(res)
            })
        });
      });
  })
})
