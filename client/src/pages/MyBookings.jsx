import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import { FaCalendarAlt, FaClock, FaUsers, FaTag } from 'react-icons/fa'; // FaDollarSign removed from import
import { IoIosCloseCircle } from 'react-icons/io';

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
                // Sort bookings by check-in date, newest first
                const sortedBookings = data.bookings.sort((a, b) => new Date(b.checkInDate) - new Date(a.checkInDate));
                setBookings(sortedBookings);
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

    const formatTime = (dateString) => new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const calculateDuration = (checkIn, checkOut) => {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const hours = Math.round((end - start) / (1000 * 60 * 60));
        return `${hours} hour${hours !== 1 ? 's' : ''}`;
    };

    const fallbackImage =
        "https://via.placeholder.com/400x300?text=No+Image+Available";

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <main className="flex-1 container mx-auto px-4 pt-28 pb-12 max-w-5xl"> 
                
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
                    My Bookings 🗓️
                </h1>

                {isLoading && (
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex h-40 bg-white rounded-xl shadow-lg animate-pulse p-4">
                                <div className="w-32 h-32 bg-gray-200 rounded-lg mr-4"></div>
                                <div className="flex-1 space-y-3">
                                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && bookings.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-xl shadow-lg mt-8 border border-gray-100">
                        <p className="text-xl font-medium text-gray-700">You don't have any active bookings.</p>
                        <p className="text-gray-500 mt-2">Start a new reservation to see it here.</p>
                    </div>
                )}

                <div className="grid gap-6">
                    {bookings.map((booking, index) => {
                        const property = booking.property || {};
                        const checkInDate = formatDate(booking.checkInDate);
                        const checkInTime = formatTime(booking.checkInDate);
                        const checkOutTime = formatTime(booking.checkOutDate);
                        const duration = calculateDuration(booking.checkInDate, booking.checkOutDate);
                        const isPaid = booking.isPaid;

                        return (
                            <div
                                key={index}
                                className="flex flex-col lg:flex-row items-start gap-6 p-6 rounded-xl border border-gray-100 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                            >
                                {/* Image and Quick ID */}
                                <div className="flex flex-col items-center w-full lg:w-48 flex-shrink-0">
                                    <div className="w-full h-36 rounded-lg overflow-hidden bg-gray-200 border border-gray-300">
                                        <img
                                            src={property.images?.[0] || fallbackImage}
                                            alt={property.name || "Property"}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="mt-2 text-sm text-gray-500 font-mono">
                                        ID: <span className="font-semibold text-gray-700">{booking.referenceId || booking._id.slice(-8)}</span>
                                    </div>
                                </div>

                                {/* Booking Details Grid */}
                                <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6 w-full">
                                    <div className="sm:col-span-3">
                                        <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                                            {property.roomType || property.name || "Reserved Room"}
                                        </h2>
                                    </div>

                                    <div className="text-sm">
                                        <p className="font-medium text-gray-600 flex items-center gap-2"><FaCalendarAlt className="text-red-500" /> Date</p>
                                        <p className="font-semibold text-gray-800">{checkInDate}</p>
                                    </div>
                                    
                                    <div className="text-sm">
                                        <p className="font-medium text-gray-600 flex items-center gap-2"><FaClock className="text-red-500" /> Time</p>
                                        <p className="font-semibold text-gray-800">{checkInTime} - {checkOutTime}</p>
                                    </div>

                                    <div className="text-sm">
                                        <p className="font-medium text-gray-600 flex items-center gap-2"><FaClock className="text-red-500" /> Duration</p>
                                        <p className="font-semibold text-gray-800">{duration}</p>
                                    </div>

                                    <div className="text-sm">
                                        <p className="font-medium text-gray-600 flex items-center gap-2"><FaUsers className="text-red-500" /> Guests</p>
                                        <p className="font-semibold text-gray-800">{booking.guests || 'N/A'}</p>
                                    </div>

                                    <div className="text-sm">
                                        <p className="font-medium text-gray-600 flex items-center gap-2"><FaTag className="text-red-500" /> Status</p>
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${isPaid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                            {isPaid ? "Paid" : "Pending Payment"}
                                        </span>
                                    </div>
                                </div>

                                {/* Total and Actions */}
                                <div className="flex flex-col items-start lg:items-end justify-between gap-4 w-full lg:w-48 flex-shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-gray-100">
                                    <div className="w-full text-left lg:text-right">
                                        {/* Updated line without the dollar sign icon */}
                                        <p className="text-sm text-gray-600 flex items-center gap-2 lg:justify-end">Total Amount</p>
                                        <p className="text-2xl font-extrabold text-red-600 mt-1">{currency}{booking.totalPrice || 0}</p>
                                    </div>

                                    <div className="flex flex-col space-y-2 w-full">
                                        {!isPaid && (
                                            <button
                                                onClick={() => handlePayment(booking._id)}
                                                className="w-full px-4 py-2 text-sm font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors shadow-md"
                                            >
                                                Pay Now
                                            </button>
                                        )}

                                        {!isPaid && (
                                            <button
                                                onClick={() => handleCancelBooking(booking._id)}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors border border-gray-300"
                                            >
                                                <IoIosCloseCircle className="text-lg" />
                                                Cancel Booking
                                            </button>
                                        )}
                                    </div>
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