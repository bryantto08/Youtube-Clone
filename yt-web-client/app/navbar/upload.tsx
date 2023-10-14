'use client';

import { Fragment, useState, MouseEventHandler, MouseEvent } from "react";
import { Video, uploadVideo } from "../firebase/functions";

import styles from "./upload.module.css";

export default function Upload() {
    const [inputs, setInputs] = useState({});
    const [file, setFile] = useState<File>();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const name = event.target.name;
      const value = event.target.value;
      setInputs(values => ({...values, [name]: value}));

    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.item(0);
        if (file) {
            setFile(file);
        }
    };

    const handleUpload = async (file: File, video: Video) => {
        try {
            const response = await uploadVideo(file, video);
            alert(`File uploaded successfully. Response: ${JSON.stringify(response)}`);
        } catch (error) {
            console.log(error);
            alert(`Failed to upload file: ${error}`);    
        }
    };

    const handleSubmit = async (event: MouseEvent<HTMLInputElement>) => {
        if (file) {
            await handleUpload(file, inputs);
        }
        else {
            alert("Failed to upload file");
        }
    }
    return (
        <Fragment>
            <div>
                <input type="text" placeholder="title" name="title" onChange={handleChange}/>
                <input type="textarea" placeholder="description" name="description"  onChange={handleChange}/>
                <input id="upload" className={styles.uploadInput} type="file" name='file' accept="video/*"  onChange={handleFileChange} required/>
                <label htmlFor="upload" className={styles.uploadButton}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
                </label>
                <input type="submit" value="Upload Video" onClick={handleSubmit}/>
            </div>
        </Fragment>
    )
}