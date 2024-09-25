import cloudinary from 'cloudinary';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './middleware/db.js';

dotenv.config();

const { BACKEND_PORT, FRONTEND_URL, CLOUDINARY_APIKEY, CLOUDINARY_NAME, CLOUDINARY_SECRET} = process.env;

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

connectDB();

app.use(cors({
    origin: [FRONTEND_URL, 'https://atom-1-j40n.onrender.com', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001',],
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization, x-auth-token',
    credentials: true
}));

cloudinary.v2.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_APIKEY,
    api_secret: CLOUDINARY_SECRET,
});

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Fallback route

// Serve the main frontend
app.use(express.static(path.join(__dirname, 'frontend', 'build')));
app.get('/admin/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

// Serve the landing frontend
app.use(express.static(path.join(__dirname, 'landing_frontend', 'build')));
app.get('/public/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'landing_frontend', 'build', 'index.html'));
});

import routeHandler from './routes/route.js';
app.use('/', routeHandler);




mongoose.connection.once('connected', async () => {
    // Start the server after the initial updates
    app.listen(BACKEND_PORT, () => {
        console.log(`Server is running on port ${BACKEND_PORT}`);
    });
});