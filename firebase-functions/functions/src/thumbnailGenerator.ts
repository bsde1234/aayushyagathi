import { storage, config } from "firebase-functions";
import { unlinkSync } from "fs";
import { spawn } from "child_process";
import * as mkdirp from "mkdirp-promise";
// Include a Service Account Key to use a Signed URL
import * as gCloudStorage from "@google-cloud/storage";

import { database, initializeApp } from "firebase-admin";

const gcs = gCloudStorage(({ keyFilename: './serviceAccountKey.json' }));
initializeApp(config().firebase);

const path = require('path');
const os = require('os');

// Max height and width of the thumbnail in pixels.
const THUMB_MAX_HEIGHT = 200;
const THUMB_MAX_WIDTH = 200;
// Thumbnail prefix added to file names.
const THUMB_PREFIX = 'thumb_';

/**
 * When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
 * ImageMagick.
 * After the thumbnail has been generated and uploaded to Cloud Storage,
 * we write the public URL to the Firebase Realtime Database.
 */
export const generateThumbnail = storage.object().onChange(event => {
  // File and directory paths.
  const filePath = event.data.name;
  const contentType = event.data.contentType; // This is the image Mimme type
  const fileDir = path.dirname(filePath);
  const fileName = path.basename(filePath);
  const thumbFilePath = path.normalize(path.join(fileDir, 'thumbnails', `${THUMB_PREFIX}${fileName}`));
  const tempLocalFile = path.join(os.tmpdir(), filePath);
  const tempLocalDir = path.dirname(tempLocalFile);
  const tempLocalThumbFile = path.join(os.tmpdir(), thumbFilePath);

  // Exit if this is triggered on a file that is not an image.
  if (!contentType.startsWith('image/')) {
    console.log('This is not an image.');
    return null;
  }

  // Exit if the image is already a thumbnail.
  if (fileName.startsWith(THUMB_PREFIX)) {
    console.log('Already a Thumbnail.');
    return null;
  }

  // Exit if this is a move or deletion event.
  if (event.data.resourceState === 'not_exists') {
    console.log('This is a deletion event.');
    return null;
  }

  // Cloud Storage files.
  const bucket = gcs.bucket(event.data.bucket);
  const file = bucket.file(filePath);
  const thumbFile = bucket.file(thumbFilePath);
  const metadata = { contentType: contentType };

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
    return bucket.upload(tempLocalThumbFile, { destination: thumbFilePath, metadata: metadata });
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
    return database().ref('images').push({ path: fileUrl, thumbnail: thumbFileUrl });
  }).then(() => console.log('Thumbnail URLs saved to database.'));
});
