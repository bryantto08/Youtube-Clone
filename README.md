# Youtube-Clone
This project is a full stack application designed emulate the YouTube website. Users
that are signed into the site can upload videos that can be viewed by anyone 
regardless of authentication credentials.


## Accessing Application
YouTube Clone can be visited [here](https://yt-web-client-n4w3k5hqlq-ue.a.run.app)

## Technology Stack
* TypeScript
* Express.js
* Next.js
* FFmpeg
* Google Cloud Platform
    * Google Cloud Run - For Deploying Application Containers
    * Pub/Sub - Message Queue to automate video processing service
    * Google Cloud Storage - To store static content such as Videos
* Firebase
    * Firebase Authentication - To authenticate users with their Google Account
    * Firestore - Database to store user and video information
    * Firebase Functions - Serverless Functions for uploading videos and updating database.
* Docker - To Containerize our services


## Currently Working On
* Adding Unique Thumbnail to Each Video
* Adding Searching Feature

## Contacts
* bryantto08@gmail.com
* https://github.com/bryantto08
