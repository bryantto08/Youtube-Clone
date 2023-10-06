// 1. GCS file interactions
// 2. Local file interactions

import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';

const storage = new Storage(); // Creating an instance of GCS Library to access API

// Two Bucket Systems: One for the Cloud with GCS, one for local
// Users upload raw videos into our rawBucket, when we finish processing, they will be stored in processedBucket
const rawVideoBucketName = 'bt88-yt-raw-videos';
const processedVideoBucketName = 'bt88-yt-processed-videos';

// rawBucket -> localRawPath -> (Processing) -> localProcessedPath -> processedBucket
const localRawVideoPath = './raw-videos';
const localProcessedVideoPath = './processed-videos';

// Create the local directories for raw and processed videos
export function setupDirectories() {
    ensureDirectoryExistence(localRawVideoPath);
    ensureDirectoryExistence(localProcessedVideoPath);
}

/**
 * Takes a video in the rawBucket with rawVideoName, converts it, and places it in processedBucket using processedVideoName
 * @param rawVideoName: St- The name of the file to convert from {@link localRawVideoPath}
 * @param processedVideoName - the Name of the file to be converted to {@link localProcessedVideoPath }
 * @returns A promise that resolves when the video has been converted
 */
export function convertVideo(rawVideoName: string, processedVideoName: string) {
    return new Promise<void>((resolve, reject) =>{
        ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
        .outputOptions("-vf", "scale=-1:360")  // convert video file "-vf" to 360p resolution
        .on("end", () => {  // Given two different returns: end means its successful.
            console.log("Processing finished successfully");
            resolve();
        })
        .on("error", (err) => {  // on error, return a 500 error status code.
            console.log(`An error occured ${err.message}`);
            reject(err);
        })
        .save(`${localProcessedVideoPath}/${processedVideoName}`);
    })

}

/**
 * 
 * @param filename - The name of the file to download from the 
 * {@link rawVideoBucketName} bucket into the {@link localRawVideoPath} folder
 * @returns A promise that resolves when the file has been downloaded
 */
export async function downloadRawVideo(filename: string) {
    await storage.bucket(rawVideoBucketName)
        .file(filename)
        .download({destination: `${localRawVideoPath}/${filename}`});
    console.log(
        `gs://${rawVideoBucketName}/${filename} downloaded to ${localRawVideoPath}/${filename}`
    );
}

/**
 * 
 * @param filename - The name of the file to upload from the
 * {@link localProcessedVideoPath} folder into the {@link processedVideoBucketName}
 * @returns A promist that resolves when the file has been uploaded
 */
export async function uploadProcessedVideo(filename: string) {
    const bucket = storage.bucket(processedVideoBucketName);

    await bucket.upload(`${localProcessedVideoPath}/${filename}`,{
        destination: filename
    });
    console.log(
        `${localProcessedVideoPath}/${filename} uploaded to gs://${processedVideoBucketName}/${filename}`
    )
    await bucket.file(filename).makePublic();
    
}

function deleteFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.log(`Failed to delete file at ${filePath}`);
                reject(err);
            }
            else {
                console.log(`File deleted at ${filePath}`);
                resolve();
            }
        });
        } else {
            console.log(`File not found at ${filePath}, skipping the delete`);
            resolve();
        }
    });
}

/**
 * 
 * @param filename the name of the file to be deleted from the 
 * {@link localRawVideoPath} folder
 * @returns A promise that resolves when the file has been deleted
 */
export function deleteRawVideo(filename: string) {
    return deleteFile(`${localRawVideoPath}/${filename}`);
}

/**
 * 
 * @param filename - the name of the file to be deleted from the 
 * {@link localProcessedVideoPath} folder
 * @returns A promise that resolves when the file has been deleted
 */
export function deleteProcessedVideo(filename: string) {
    return deleteFile(`${localProcessedVideoPath}/${filename}`);
}

/**
 * Ensures that a directory exists, creating it if it does not.
 * @param dirPath - The directory path to check
 */
function ensureDirectoryExistence(dirPath: string) {
    if (!fs.existsSync(dirPath)) {  // If directory doesn't exist, mkdir
        fs.mkdirSync(dirPath, {recursive: true}); // recursive: true enables creating nested directory
        console.log(`Directory created at ${dirPath}`);
    }
}