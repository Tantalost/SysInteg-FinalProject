import express from 'express';
import "dotenv/config.js";
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import clearkWebhooks from './controllers/clerkWebhooks.js';
import userRouter from './routes/userRoutes.js';
import roomRouter from './routes/roomRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import propertyRouter from './routes/propertyRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import { stripeWebhooks } from './controllers/stripeWebhooks.js';

const app = express();

connectDB();
connectCloudinary();

// ---------- FIX CORS (PLACE THIS FIRST) ----------
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://cynergy-self.vercel.app");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});
// -------------------------------------------------

// Stripe webhook must stay RAW
app.post(
  '/api/bookings/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhooks
);

// JSON parser
app.use(express.json());

// Clerk
app.use(clerkMiddleware());

// Routes
app.get('/', (req, res) => res.send("API is working"));
app.use('/api/clerk', clearkWebhooks);
app.use('/api/user', userRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/properties', propertyRouter);
app.use('/api/bookings', bookingRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
