import { credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { Firestore } from "firebase-admin/firestore";

initializeApp({credential: credential.applicationDefault()});

const firestore = new Firestore();

const videoCollectionId = 'videos';

// Question mark means we'll make it optional
export interface Video {
    id?: string,
    uid?: string,
    filename?: string,
    status?: 'processing' | 'processed',
    title?: string,
    description?: string
}

// Video a representation of a document that is outlined above
export function setVideo(videoId: string, video: Video) {
    firestore.collection(videoCollectionId)
        .doc(videoId)  // doc is the unique id of a document that differentiates from other documents
        .set(video, {merge: true});
}