// 1. GCS file interactions
// 2. Local file interactions

import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';


// Create the local directories for raw and processed videos
export function setupDirectories() {

}

/**
 * @param rawVideoName - The name of the file to convert from {@link localRaw}
 */