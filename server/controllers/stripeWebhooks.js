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

    // 3. Handle the Event: Now listening for payment_intent.succeeded
    // This event confirms the actual funds capture.
    if (event.type === 'payment_intent.succeeded') {
        // The event object is now a PaymentIntent (renamed from 'session' to 'intent')
        const intent = event.data.object; 

        // 4. Retrieve the bookingId from the PaymentIntent's metadata
        // NOTE: The bookingId MUST be passed into the PaymentIntent's metadata
        // during the initial Checkout Session creation for this to work.
        const bookingId = intent.metadata?.bookingId; 
        
        if (bookingId) {
            try {
                await Booking.findByIdAndUpdate(bookingId, { 
                    isPaid: true, 
                    paymentMethod: "Stripe",
                    // The Payment Intent ID is now the ID of the object itself
                    paymentId: intent.id 
                });
                console.log(`✅ Booking ${bookingId} marked as paid using Payment Intent: ${intent.id}`);
            } catch (error) {
                console.error('Error updating booking in DB:', error);
                return response.status(500).json({ error: 'Database update failed' });
            }
        } else {
            console.error('❌ No bookingId found in Payment Intent metadata');
        }
    } else {
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    // Return a 200 response to Stripe to acknowledge receipt of the event
    response.json({ received: true });
};