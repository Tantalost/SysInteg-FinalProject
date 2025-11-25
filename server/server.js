// server.js
import express from 'express';
import 'dotenv/config.js';
import cors from 'cors';
import connectDB from './configs/db.js';
import connectCloudinary from './configs/cloudinary.js';
import { clerkMiddleware } from '@clerk/express';

import clearkWebhooks from './controllers/clerkWebhooks.js';
import { stripeWebhooks } from './controllers/stripeWebhooks.js';

import userRouter from './routes/userRoutes.js';
import roomRouter from './routes/roomRoutes.js';
import propertyRouter from './routes/propertyRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';

const app = express();

/* ---------------------------
    INITIALIZE SERVICES
----------------------------*/
connectDB();
connectCloudinary();

/* ---------------------------
    CORS CONFIG (IMPORTANT)
----------------------------*/
const corsOptions = {
  origin: [
    "https://cynergy-self.vercel.app", // your frontend
    "http://localhost:5173"            // local dev
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));      // CORS MUST COME FIRST
app.options('*', cors(corsOptions));

/* ---------------------------
    JSON BODY PARSER
----------------------------*/
app.use(express.json());

/* ---------------------------
    CLERK AUTH MIDDLEWARE
----------------------------*/
app.use(clerkMiddleware());

/* ---------------------------
    STRIPE WEBHOOK (RAW BODY)
    MUST COME AFTER CORS 
    AND BEFORE express.json overrides.
----------------------------*/
app.post(
  "/api/bookings/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

/* ---------------------------
    NORMAL API ROUTES
----------------------------*/
app.get("/", (req, res) => res.send("API is working"));

app.use("/api/clerk", clearkWebhooks);
app.use("/api/user", userRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/properties", propertyRouter);
app.use("/api/bookings", bookingRouter);

/* ---------------------------
    START SERVER
----------------------------*/
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;  // required for Vercel
