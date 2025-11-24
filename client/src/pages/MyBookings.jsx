import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

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

                                {/* DETAILS */}
                                <div className="flex-1 space-y-1">
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        {property.name || "Property No Longer Exists"}
                                    </h2>

                                    <p className="text-gray-600">
                                        Room: {room.name || room.roomNumber || "Room Info Unavailable"}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {new Date(booking.checkInDate).toDateString()} —{" "}
                                        {new Date(booking.checkOutDate).toDateString()}
                                    </p>

                                    <p className="font-bold text-gray-900 mt-2">
                                        Total: {currency} {booking.totalPrice}
                                    </p>
                                </div>

                                {/* STATUS BADGE */}
                                <div className="flex items-center md:justify-end mt-3 md:mt-0">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            booking.isPaid
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                        }`}
                                    >
                                        {booking.isPaid ? "Paid" : "Pay at Location"}
                                    </span>
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
