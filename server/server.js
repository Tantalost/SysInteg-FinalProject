import express from 'express';
import "dotenv/config.js";
import cors from 'cors';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express';
import clearkWebhooks from './controllers/clerkWebhooks.js';
import userRouter from './routes/userRoutes.js';
import roomRouter from './routes/roomRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import propertyRouter from './routes/propertyRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import { stripeWebhooks } from './controllers/stripeWebhooks.js';

const app = express();

// =======================
// 🔐 DATABASE & CLOUD
// =======================
connectDB();
connectCloudinary();

// =======================
// 🌍 CORS FIRST!
// =======================
app.use(
  cors({
    origin: ['https://cynergy-self.vercel.app'], // your deployed frontend
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Allow preflight
app.options('*', cors());

// =======================
// 🧾 CLERK (Before routing)
// =======================
app.use(clerkMiddleware());

// =======================
// ⚡ STRIPE WEBHOOK BEFORE express.json
// =======================
app.post(
  '/api/bookings/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhooks
);

// =======================
// 📦 Normal JSON after webhook
// =======================
app.use(express.json());

// =======================
// 🛣 ROUTES
// =======================
app.get('/', (req, res) => res.send("API is working"));
app.use("/api/clerk", clearkWebhooks);
app.use('/api/user', userRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/properties', propertyRouter);
app.use('/api/bookings', bookingRouter);

// =======================
// 🚀 START SERVER (ignored by Vercel but needed locally)
// =======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
