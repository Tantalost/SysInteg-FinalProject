import Stripe from "stripe";
import Booking from "../models/Booking.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhookHandler = async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            req.rawBody,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("❌ Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle checkout session completed
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const bookingId = session.success_url?.split("booking=")[1];

        console.log("🔥 Payment complete for booking:", bookingId);

        if (bookingId) {
            await Booking.findByIdAndUpdate(bookingId, {
                status: "paid"
            });

            console.log("✅ Booking updated to PAID in MongoDB");
        }
    }

    res.json({ received: true });
};
