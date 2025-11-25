import express from "express";
import { stripeWebhookHandler } from "../controllers/stripeWebhooks.js";

const router = express.Router();

router.post("/webhook", stripeWebhookHandler);

export default router;