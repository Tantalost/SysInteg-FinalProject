import React, { useContext, useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import axios from 'axios' // Or use from context if available

const MyBookings = () => {
    // Assuming context provides these
    const { user, getToken, toast, currency } = useAppContext();
    const [bookings, setBookings] = useState([]);

    const getUserBookings = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get('/api/bookings/user', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                setBookings(data.bookings);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (user) {
            getUserBookings();
        }
    }, [user]);

    if (!bookings) return <div>Loading...</div>;

    return (
        <div className='container mx-auto px-4 py-8'>
            <h1 className='text-2xl font-bold mb-6'>My Bookings</h1>
            <div className='grid gap-4'>
                {bookings.map((booking, index) => (
                    <div key={index} className='border p-4 rounded shadow-sm flex flex-col md:flex-row gap-4'>
                        {/* IMAGE HANDLING: Check if property exists first */}
                        <div className='w-full md:w-48 h-32 bg-gray-200 rounded overflow-hidden'>
                             <img 
                                src={booking.property?.images?.[0] || 'placeholder.jpg'} 
                                alt={booking.property?.name || 'Property'}
                                className='w-full h-full object-cover' 
                             />
                        </div>

                        <div className='flex-1'>
                            <h2 className='text-xl font-semibold'>
                                {booking.property?.name || 'Property No Longer Exists'}
                            </h2>
                            
                            {/* FIX: Handle null room and incorrect field name */}
                            <p className='text-gray-600'>
                                Room: {booking.room?.name || booking.room?.roomNumber || 'Room Info Unavailable'}
                            </p>
                            
                            <p className='text-sm text-gray-500'>
                                {new Date(booking.checkInDate).toDateString()} - {new Date(booking.checkOutDate).toDateString()}
                            </p>
                            <p className='font-bold mt-2'>
                                Total: {currency} {booking.totalPrice}
                            </p>
                        </div>
                        
                        <div className='flex items-center'>
                             <span className={`px-3 py-1 rounded-full text-sm ${
                                booking.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                             }`}>
                                {booking.isPaid ? 'Paid' : 'Pay at Location'}
                             </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyBookings