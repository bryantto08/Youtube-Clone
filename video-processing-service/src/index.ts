import express from "express";
import ffmpeg from "fluent-ffmpeg";
import { convertVideo, deleteProcessedVideo, deleteRawVideo, downloadRawVideo, setupDirectories, uploadProcessedVideo } from "./storage";
import { OutgoingMessage } from "http";
import { isVideoNew, setVideo } from "./firestore";

setupDirectories(); // creating local storage for raw and processed videoes

const app = express();

app.use(express.json());  // middleware so that express can handle JSON

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// This endpoint won't be invoked by client but rather a Cloud Pub/Sub (Message Queue)
app.post('/process-video', async (req, res) => {
    // Get the bucket and filename from the Cloud Pub/Sub message
    let data;
    try {
        const message = Buffer.from(req.body.message.data, 'base64').toString('utf-8');
        data = JSON.parse(message);
        if (!data.name) {
            throw new Error("Invalid message payload received");
        }
    } catch (error) {
        console.error(error);
        return res.status(400).send("Bad Request: missing filename");
    }

    const inputFileName = data.name;  // Format of <UID>-<DATE> , <EXTENSION
    const outputFilename = `processed-${inputFileName}`;
    const videoId = inputFileName.split('.')[0];  // <UID>-<DATE>
    
    if (!isVideoNew(videoId)) {
        return res.status(400).send("Bad Request: Video already processing or processed");
    } else {
        await setVideo(videoId, {
            id: videoId,
            uid: videoId.split("-")[0],
            status: 'processing',
        });
    }

    // Download the raw video from Cloud Storage
    await downloadRawVideo(inputFileName);

    // Convert the video to 360p
    try {
        await convertVideo(inputFileName, outputFilename);
    } catch(error) {
        await Promise.all([
            deleteRawVideo(inputFileName),
            deleteProcessedVideo(outputFilename)
        ])
        console.error(error);
        return res.status(500).send("Internal server Error: video processing failed");
    }

    // Upload the processed video to Cloud storage
    await uploadProcessedVideo(outputFilename);

    setVideo(videoId, {
        status: 'processed',
        filename: outputFilename
    });

    await Promise.all([
        deleteRawVideo(inputFileName),
        deleteProcessedVideo(outputFilename)
    ])
    return res.status(200).send("Processed Video successfully");
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Video Processing service listening at http://localhost:${port}`)
});