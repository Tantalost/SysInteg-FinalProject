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

/* INIT */
connectDB();
connectCloudinary();

/* CORS */
const corsOptions = {
  origin: [
    "https://cynergy-self.vercel.app",
    "http://localhost:5173"
  ],
  credentials: true,
};
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

/* JSON Parser */
app.use(express.json());

/* Clerk */
app.use(clerkMiddleware());

/* Stripe Webhook */
app.post(
  "/api/bookings/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

/* ROUTES */
app.get("/", (req, res) => res.send("API is working"));

app.use("/api/clerk", clearkWebhooks);
app.use("/api/user", userRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/properties", propertyRouter);
app.use("/api/bookings", bookingRouter);

/* ⛔ DO NOT USE app.listen() ON VERCEL */
/* Instead export the app */

export default app;
