# Notes App

 Note app is a web application that allows users to create, read, update, and delete notes. It uses a NoSQL database to store the notes. The app is built using Node.js, Express, and MongoDB. The app is hosted on Netlify.

## Links

First start the backend API and then start the frontend app.

[Notes App Frontend](https://notes-app-blog.netlify.app/)

[Notes App Backend](https://note-app-backend-i8l9.onrender.com/)

## Testing

    - npm install
    - npm run dev

## .env

    DB_NAME=
    DB_PASSWORD=
    DB_USERNAME=
    DB_CLUSTER=
    DB_URL=localhost:
    JWT_SECRET=
    GMAIL_EMAIL=
    GMAIL_PASSWORD=
    CLIENT_URL_LOCAL=<http://localhost:5173>
    CLIENT_URL_CLOUD=<https://password-reset-blog.netlify.app>
    PORT=5000
    isLOCAL=false

## API Endpoints

    - [GET] /notes
    - [POST] /notes
    - [PUT] /notes/:id
    - [DELETE] /notes/:id

## Git Repository

[Backend Repository](https://github.com/automationblog/note_app_backend)

[Frontend Repository](https://github.com/automationblog/note_app_frontend)
