import express from 'express';
import "dotenv/config.js";
import cors from 'cors';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import clearkWebhooks from './controllers/clerkWebhooks.js';
import userRouter from './routes/userRoutes.js';
import roomRouter from './routes/roomRoutes.js';
import connectCloudinary from './configs/cloudinary.js';


connectDB()
connectCloudinary()

const app = express();
app.use(cors()) // Enable CORS for all routes

// Middleware to parse JSON bodies
app.use(express.json()) 
app.use(clerkMiddleware())

// API for Webhooks
app.use("/api/clerk", clearkWebhooks);

app.get('/', (req, res)=> res.send("API is working"))
app.use('/api/user', userRouter)
app.use('/api/rooms', roomRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));