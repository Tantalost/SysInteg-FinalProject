import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';

const PaymentSuccess = () => {
    // Hooks to handle URL parameters and navigation
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Custom hook to access axios, tokens, etc.
    const { axios, getToken } = useAppContext();
    
    // Get the bookingId from the URL query parameters: ?booking=12345
    const bookingId = searchParams.get('booking');
    
    // The core logic runs when the component loads
    useEffect(() => {
        const verifyBooking = async () => {
            // Check if we actually have a booking ID to work with
            if (!bookingId) {
                toast.error("Booking ID not found in URL. Cannot verify payment.");
                setTimeout(() => navigate('/my-bookings'), 3000);
                return;
            }

            // We rely on the Stripe Webhook to update the DB, 
            // but we can call a lighter confirmation API here if needed.
            // However, the cleanest approach is to simply display success 
            // and rely ONLY on the webhook for the DB update.

            // OPTIONAL: You can add an API call here to confirm the status 
            // from the backend, but since you are using webhooks, 
            // the main job is just to display the success message 
            // and redirect while the webhook runs asynchronously.

            toast.success("Payment successful! Please wait while we confirm your booking details.");
            
            // Redirect back to 'My Bookings' after a short delay (e.g., 3 seconds) 
            // to give the Stripe Webhook time to process and update the DB.
            setTimeout(() => {
                // The navigate function here will also trigger a refresh 
                // of the MyBookings data, showing the new paid status.
                navigate('/my-bookings');
            }, 3000); 
        };

        verifyBooking();
    }, [bookingId, navigate, axios]); // Dependencies

    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg">
                <svg 
                    className="w-16 h-16 mx-auto text-green-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h2 className="text-3xl font-bold text-gray-800 mt-4">Payment Received!</h2>
                <p className="text-gray-600 mt-2">
                    Thank you for your booking. The payment is successful.
                </p>
                <p className="text-sm text-gray-500 mt-4">
                    Redirecting to your bookings page in a moment...
                </p>
                <div className="mt-5 w-8 h-8 mx-auto border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
        </div>
    );
};

export default PaymentSuccess;