import { storage, config } from "firebase-functions";
import { unlinkSync } from "fs";
import { spawn } from "child_process";
import * as mkdirp from "mkdirp-promise";
import { serviceAccountKey } from './serviceAccountKey'
import { basename, dirname, join, normalize, extname } from "path";
import { tmpdir } from "os";
// Include a Service Account Key to use a Signed URL

import { firestore, initializeApp, storage as adminStorage } from "firebase-admin";

const THUMB_MAX_WIDTH = 200;
const THUMB_MAX_HEIGHT = 200;
const app = initializeApp(config().firebase);

export const generatePhotoThumbnail = storage.object().onChange(event => {
  const filePath = event.data.name;
  const fileName = basename(filePath);
  const _id = basename(filePath, extname(filePath));
  const contentType = event.data.contentType;
  const thumbFilePath = normalize(join('profile_thumbnails', `${fileName}`));
  const tempLocalFile = join(tmpdir(), filePath);
  const tempLocalDir = dirname(tempLocalFile);
  console.log(event.data.bucket)
  if (event.data.bucket === 'profile_photos') {
    console.log('Event not on profile_photos', event.data.bucket);
    return null
  }
  if (!contentType.startsWith('image/')) {
    console.log('This is not an image.');
    return null;
  }

  if (event.data.resourceState === 'not_exists') {
    console.log('This is a deletion event.');
    return null;
  }

  const bucket = adminStorage(app).bucket(event.data.bucket);
  const thumbBucket = adminStorage(app).bucket('profile_thumbnails');
  const file = bucket.file(filePath);
  const thumbFile = thumbBucket.file(thumbFilePath);
  const metadata = { contentType: contentType };
  const tempLocalThumbFile = join(tmpdir(), thumbFilePath);

  // Create the temp directory where the storage file will be downloaded.
  return mkdirp(tempLocalDir).then(() => {
    // Download file from bucket.
    return file.download({ destination: tempLocalFile });
  }).then(() => {
    console.log('The file has been downloaded to', tempLocalFile);
    // Generate a thumbnail using ImageMagick.
    return spawn('convert', [tempLocalFile, '-thumbnail', `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>`, tempLocalThumbFile], {});
  }).then(() => {
    console.log('Thumbnail created at', tempLocalThumbFile);
    // Uploading the Thumbnail.
    return thumbBucket.upload(tempLocalThumbFile, { destination: thumbFilePath, metadata: metadata });
  }).then(() => {
    console.log('Thumbnail uploaded to Storage at', thumbFilePath);
    // Once the image has been uploaded delete the local files to free up disk space.
    unlinkSync(tempLocalFile);
    unlinkSync(tempLocalThumbFile);
    // Get the Signed URLs for the thumbnail and original image.
    const _config = {
      action: 'read',
      expires: '03-01-2500'
    };
    return Promise.all([
      thumbFile.getSignedUrl(_config),
      file.getSignedUrl(_config)
    ]);
  }).then(results => {
    console.log('Got Signed URLs.');
    const thumbResult = results[0];
    const originalResult = results[1];
    const thumbFileUrl = thumbResult[0];
    const fileUrl = originalResult[0];
    // Add the URLs to the Database
    return firestore().collection('profiles').doc(_id).update({ thumbUrl: thumbFileUrl, photo: fileUrl });
  })
    .then(() => console.log('Thumbnail URLs saved to database.'));;
});
