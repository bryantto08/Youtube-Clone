import express from "express";
import ffmpeg from "fluent-ffmpeg";

const app = express();

app.use(express.json());  // middleware so that express can handle JSON

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post('/process-video', (req, res) => {
    // Get path of the input video file that we want to convert from the request body
    // We want to convert it to 360p and then save it
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;

    // error handling to see if body data is undefined
    if (!inputFilePath || !outputFilePath) {
        res.status(400).send("Bad Request: Missing file path.");
    }
    ffmpeg(inputFilePath)
        .outputOptions("-vf", "scale=-1:360")  // convert video file "-vf" to 360p resolution
        .on("end", () => {  // Given two different returns: end means its successful.
            res.status(200).send("Processing finished successfully");
        })
        .on("error", (err) => {  // on error, return a 500 error status code.
            console.log(`An error occured ${err.message}`);
            res.status(500).send(`Internal Server Error: ${err.message}`);
        })
        .save(outputFilePath);
        
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Video Processing service listening at http://localhost:${port}`)
});