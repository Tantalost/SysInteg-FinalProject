import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const MyBookings = () => {
    const { user, axios, getToken, currency } = useAppContext();
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const getUserBookings = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get("/api/bookings/user", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (data.success) {
                setBookings(data.bookings);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePayment = async (bookingId) => {
        try {
            const { data } = await axios.post(
                "/api/bookings/stripe-payment",
                { bookingId },
                { headers: { Authorization: `Bearer ${await getToken()}` } }
            );

            if (data.success) {
                window.location.href = data.url;
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) {
            return;
        }

        try {
            const { data } = await axios.delete(`/api/bookings/${bookingId}`, {
                headers: { Authorization: `Bearer ${await getToken()}` },
            });

            if (data.success) {
                setBookings((prev) => prev.filter((booking) => booking._id !== bookingId));
                toast.success("Booking cancelled successfully.");
            } else {
                toast.error(data.message || "Unable to cancel booking.");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (user) getUserBookings();
    }, [user]);

    const fallbackImage =
        "https://via.placeholder.com/400x300?text=No+Image+Available";

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 container mx-auto px-4 py-20 max-w-5xl">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">
                    My Bookings
                </h1>

                {isLoading && (
                    <div className="space-y-4 animate-pulse">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                        ))}
                    </div>
                )}

                {!isLoading && bookings.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-lg">No bookings yet.</p>
                    </div>
                )}

                <div className="grid gap-6">
                    {bookings.map((booking, index) => {
                        const property = booking.property || {};
                        const room = booking.room || {};

                        return (
                            <div
                                key={index}
                                className="flex flex-col md:flex-row items-start gap-5 p-5 rounded-xl border bg-white shadow-md hover:shadow-lg transition-all"
                            >
                                <div className="w-full md:w-48 h-36 rounded-lg overflow-hidden bg-gray-200">
                                    <img
                                        src={property.images?.[0] || fallbackImage}
                                        alt={property.name || "Property"}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold">
                                        {booking.property?.roomType || booking.property?.name || "Room"}
                                    </h2>

                                    <p className="text-gray-600 mt-1">
                                        Booking ID: <span className="font-mono text-sm">{booking.referenceId || booking._id.slice(-8)}</span>
                                    </p>

                                    <p className="text-sm text-gray-500 mt-2">
                                        <span className="font-medium">Date:</span> {new Date(booking.checkInDate).toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric', 
                                            year: 'numeric' 
                                        })}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        <span className="font-medium">Time:</span> {new Date(booking.checkInDate).toLocaleTimeString('en-US', { 
                                            hour: '2-digit', 
                                            minute: '2-digit',
                                            hour12: true 
                                        })} - {new Date(booking.checkOutDate).toLocaleTimeString('en-US', { 
                                            hour: '2-digit', 
                                            minute: '2-digit',
                                            hour12: true 
                                        })}
                                    </p>

                                    <p className="text-sm text-gray-500 mt-1">
                                        <span className="font-medium">Duration:</span> {(() => {
                                            const start = new Date(booking.checkInDate)
                                            const end = new Date(booking.checkOutDate)
                                            const hours = Math.round((end - start) / (1000 * 60 * 60))
                                            return `${hours} hour${hours !== 1 ? 's' : ''}`
                                        })()}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        <span className="font-medium">Guests:</span> {booking.guests || 'N/A'}
                                    </p>

                                    <p className="font-bold mt-3 text-lg">
                                        Total: {currency}{booking.totalPrice || 0}
                                    </p>
                                </div>

                                <div className="flex flex-col items-start md:items-end gap-2 mt-4 md:mt-0 w-full md:w-auto">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm ${booking.isPaid
                                            ? "bg-green-100 text-green-800"
                                            : "bg-yellow-100 text-yellow-800"
                                            }`}
                                    >
                                        {booking.isPaid ? "Paid" : "Pay at Location"}
                                    </span>

                                    {!booking.isPaid && (
                                        <button
                                            onClick={() => handlePayment(booking._id)}
                                            className="px-4 py-1.5 text-xs border border-gray-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer"
                                        >
                                            Pay Now
                                        </button>
                                    )}

                                    {!booking.isPaid && (
                                        <button
                                            onClick={() => handleCancelBooking(booking._id)}
                                            className="px-4 py-1.5 text-xs font-semibold rounded-full bg-red-500 text-white hover:bg-red-600 transition-all cursor-pointer"
                                        >
                                            Cancel Booking
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

export default MyBookings;
