import Stripe from "stripe";
import Booking from "../models/Booking.js";

export const stripeWebhooks = async (request, response) => {
    // 1. Correct Initialization
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const sig = request.headers['stripe-signature'];
    let event;

    try {
        // 2. Construct the event using the RAW body (Crucial!)
        event = stripe.webhooks.constructEvent(
            request.body, 
            sig, 
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("⚠️ Webhook signature verification failed.", err.message);
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // 3. Handle the Event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        // 4. Retrieve the bookingId we stored in Step 1
        const bookingId = session.metadata?.bookingId;
        if (bookingId) {
            try {
                await Booking.findByIdAndUpdate(bookingId, { 
                    isPaid: true, 
                    paymentMethod: "Stripe",
                    paymentId: session.payment_intent 
                });
                console.log(`✅ Booking ${bookingId} marked as paid.`);
            } catch (error) {
                console.error('Error updating booking in DB:', error);
                return response.status(500).json({ error: 'Database update failed' });
            }
        } else {
            console.error('❌ No bookingId found in session metadata');
        }
    } else {
        console.log(`Unhandled event type: ${event.type}`);
    }
    response.json({ received: true });
};