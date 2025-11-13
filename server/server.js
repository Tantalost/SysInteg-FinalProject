import express from 'express';
import "dotenv/config.js";
import cors from 'cors';

const app = express();
app.use(cors()) // Enable CORS for all routes

app.get('/', (req, res)=> res.send("API is working"))

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));