import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions";
import {initializeApp} from "firebase-admin/app";
import {Firestore} from "firebase-admin/firestore";
import {Storage} from "@google-cloud/storage";
import {onCall} from "firebase-functions/v2/https";
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// We initialize the application and firestore before the functions
initializeApp();
const firestore = new Firestore();
const storage = new Storage();

const rawVideoBucketName = "bt88-yt-raw-videos";

const videoCollectionId = "videos";

// Question mark means we'll make it optional
export interface Video {
    id?: string,
    uid?: string,
    filename?: string,
    status?: "processing" | "processed",
    title?: string,
    description?: string
}
export const createUser = functions.auth.user().onCreate((user) => {
    const userInfo = {
        uid: user.uid,
        email: user.email,
        photoUrl: user.photoURL,
    };

    firestore.collection("users").doc(user.uid).set(userInfo);  // Create document into Firestore Users Collection
    logger.info(`User Created ${JSON.stringify(userInfo)}`);  // Logs into the google cloud logger

});

// Function to generate uploadURL
export const generateUploadUrl = onCall({maxInstances: 1}, async (request) => {
    // Check if the user is authenticated
    if (!request.auth) {
        throw new functions.https.HttpsError(
            "failed-precondition",
            "The function must be called while authenticated."
        );
    }
    const auth = request.auth;
    const data = request.data;
    const bucket = storage.bucket(rawVideoBucketName);  // Instance of our rawVideoBucket

    // Generate a unique filename
    const filename = `${auth.uid}-${Date.now()}.${data.fileExtension}`;

    // Create new video document in the firestore DB
    const videoId = filename.split(".")[0];
    await firestore.collection(videoCollectionId).doc(videoId).set({
        id: videoId,
        uid: videoId.split("-")[0],
        title: data.video["title"],
        description: data.video["description"],
        filename: filename,
    }, {merge: true});

    // Get a v4 signed URL for uploading file
    const [url] = await bucket.file(filename).getSignedUrl({
        version: "v4",
        action: "write",
        expires: Date.now() + 15 * 60 * 1000,  // 15 minutes
    });

    return {url, filename};
});

export const getVideos = onCall({maxInstances: 1}, async() => {
    const snapshot = await firestore.collection(videoCollectionId).limit(10).get();
    return snapshot.docs.map((docs) => docs.data());
})
