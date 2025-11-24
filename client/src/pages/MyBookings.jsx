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

    useEffect(() => {
        if (user) getUserBookings();
    }, [user]);

    const fallbackImage =
        "https://via.placeholder.com/400x300?text=No+Image+Available";

    return (
        <div className="min-h-screen flex flex-col">
            {/* MAIN PAGE CONTENT */}
            <main className="flex-1 container mx-auto px-4 py-20 max-w-5xl">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">
                    My Bookings
                </h1>

                {/* LOADING STATE */}
                {isLoading && (
                    <div className="space-y-4 animate-pulse">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                        ))}
                    </div>
                )}

                {/* EMPTY STATE */}
                {!isLoading && bookings.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-lg">No bookings yet.</p>
                    </div>
                )}

                {/* BOOKINGS LIST */}
                <div className="grid gap-6">
                    {bookings.map((booking, index) => {
                        const property = booking.property || {};
                        const room = booking.room || {};

                        return (
                            <div
                                key={index}
                                className="flex flex-col md:flex-row items-start gap-5 p-5 rounded-xl border bg-white shadow-md hover:shadow-lg transition-all"
                            >
                                {/* IMAGE */}
                                <div className="w-full md:w-48 h-36 rounded-lg overflow-hidden bg-gray-200">
                                    <img
                                        src={property.images?.[0] || fallbackImage}
                                        alt={property.name || "Property"}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold">
                                        {booking.property?.name || "Property No Longer Exists"}
                                    </h2>

                                    <p className="text-gray-600">
                                        Room: {room.name || room.roomNumber || "Room Info Unavailable"}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {new Date(booking.checkInDate).toDateString()} -{" "}
                                        {new Date(booking.checkOutDate).toDateString()}
                                    </p>

                                    <p className="font-bold mt-2">
                                        Total: {currency} {booking.totalPrice}
                                    </p>
                                </div>

                                <div className="flex items-center">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm ${booking.isPaid
                                                ? "bg-green-100 text-green-800"
                                                : "bg-yellow-100 text-yellow-800"
                                            }`}
                                    >
                                        {booking.isPaid ? "Paid" : "Pay at Location"}
                                    </span>
                                </div>

                                {/* FIXED: BUTTON MOVED *INSIDE* THE MAIN WRAPPER */}
                                {!booking.isPaid && (
                                    <button
                                        onClick={() => handlePayment(booking._id)}
                                        className="px-4 py-1.5 mt-4 text-xs border border-gray-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer"
                                    >
                                        Pay Now
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

export default MyBookings;
