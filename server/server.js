import express from 'express';
import "dotenv/config.js";
import cors from 'cors';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import clearkWebhooks from './controllers/clerkWebhooks.js';


connectDB()

const app = express();
app.use(cors()) // Enable CORS for all routes

// Middleware to parse JSON bodies
app.use(express.json()) 
app.use(clerkMiddleware())

// API for Webhooks
app.use("/api/clerk", clearkWebhooks);

app.get('/', (req, res)=> res.send("API is working"))

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));