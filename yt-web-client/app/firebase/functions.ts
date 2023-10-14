import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';


const generateUploadUrl = httpsCallable(functions, 'generateUploadUrl');
const getVideosFunction = httpsCallable(functions, 'getVideos');

export interface Video {
    id?: string,
    uid?: string,
    filename?: string,
    status?: "processing" | "processed",
    title?: string,
    description?: string
}

export async function uploadVideo(file: File, video: Video) {
    const response: any = await generateUploadUrl({
        fileExtension: file.name.split(".").pop(),
        video: video
    });
    console.log(response.data.url);
    // Upload the file via the signedURL
    const uploadResult = await fetch(response?.data?.url, {
        method: "PUT",
        body: file,
        headers: {
            'Content-Type': file.type,
        }
    });
    return uploadResult;
   
}

export async function getVideos() {
    const response: any = await getVideosFunction();
    return response.data as Video[];
}