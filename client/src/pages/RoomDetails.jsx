import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { assets, facilityIcons, roomCommonData } from '../assets/assets'
import Ratings from '../components/Ratings'
import { useAppContext } from '../context/AppContext.jsx'

import axios from 'axios'
import { toast } from 'react-hot-toast'

const RoomDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const { properties, currency, getToken, user } = useAppContext();

    const [selectedProperty, setSelectedProperty] = useState(null)
    const [mainImage, setMainImage] = useState(null)

    // Form States
    const [checkInDate, setCheckInDate] = useState('')
    const [duration, setDuration] = useState(1)
    const [guests, setGuests] = useState(1)
    const [startTime, setStartTime] = useState('');

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error("You must be logged in to book.");
            return;
        }

        try {
            const token = await getToken();

            console.log("SENDING BOOKING DATA:", {
                property: id,
                room: id,
                date: checkInDate,   
                startTime,     
                duration: Number(duration),
                guests: Number(guests)
            });
            const { data } = await axios.post(
                '/api/bookings/book',
                {
                    property: id,
                    room: id,
                    date: checkInDate,
                    startTime,
                    duration: Number(duration),
                    guests: Number(guests),
                    paymentMethod: "Pay at Site"
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
                if (data.bookingReference) {
                    toast.success(`Booking successful! Your Reference ID is: ${data.bookingReference}`);
                } else {
                    toast.success(data.message);
                }
                navigate('/my-bookings');
                window.scrollTo(0, 0);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            // Handle Axios error response safely
            const errorMessage = error.response?.data?.message || error.message;
            toast.error(errorMessage);
        }
    };

    useEffect(() => {
        if (properties && properties.length > 0) {
            const foundProperty = properties.find(item => item._id === id);

            if (foundProperty) {
                setSelectedProperty(foundProperty);
                setMainImage(foundProperty.images[0]);
            }
        }
    }, [id, properties])

    if (!selectedProperty) {
        return <div className='min-h-screen flex justify-center items-center'>Loading...</div>
    }

    return (
        <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>
            <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
                <h1 className='text-3xl md:text-4xl font-playfair'>
                    {selectedProperty.roomType}
                </h1>
                <p className='text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full'>20% OFF</p>
            </div>

            <div className='flex items-center gap-1 mt-2'>
                <Ratings />
                <p className='ml-2'>200+ reviews</p>
            </div>

            <div className='flex flex-col lg:flex-row mt-6 gap-6'>
                <div className='lg:w-1/2 w-full'>
                    <img src={mainImage} alt="Room Main"
                        className='w-full rounded-xl shadow-lg object-cover h-[400px]' />
                </div>
                <div className='grid grid-cols-2 gap-4 lg:w-1/2 w-full'>
                    {selectedProperty.images.map((image, index) => (
                        <img
                            key={index}
                            onClick={() => setMainImage(image)}
                            src={image}
                            alt={`View ${index + 1}`}
                            className={`w-full rounded-xl shadow-md object-cover 
                            cursor-pointer h-[190px] ${mainImage === image ? 'outline-4 outline-orange-500' : ''}`}
                        />
                    ))}
                </div>
            </div>

            {/* Room Highlights */}
            <div className='flex flex-col md:flex-row md:justify-between mt-10'>
                <div className='flex flex-col'>
                    <h1 className='text-3xl md:text-4xl font-playfair'>Experience Entertainment Like Never Before</h1>
                    <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                        {selectedProperty.amenities.map((item, index) => (
                            <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100'>
                                {facilityIcons[item] && <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />}
                                <p className='text-xs'>{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <p className='text-2xl font-medium'>
                    {currency}{selectedProperty.pricePerHour}<span className='text-sm text-gray-500'>/hour</span>
                </p>
            </div>

            {/* CheckIn Form */}
            <form onSubmit={onSubmitHandler} className='flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl'>
                <div className='flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500'>
                    <div className='flex flex-col'>
                        <label htmlFor="checkInDate" className='font-medium'>Date</label>
                        <input type="date" id='checkInDate' required
                            value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)}
                            className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' />
                    </div>
                    <div className='flex flex-col'>
                        <label className='font-medium'>Start Time</label>
                        <input
                            type="time"
                            required
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none'
                        />
                    </div>
                    <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
                    <div className='flex flex-col'>
                        <label htmlFor="Duration" className='font-medium'>Duration (Hrs)</label>
                        <input type="number" id='Duration' min="1"
                            value={duration} onChange={(e) => setDuration(e.target.value)}
                            className='max-w-30 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' />
                    </div>
                    <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
                    <div className='flex flex-col'>
                        <label htmlFor="guests" className='font-medium'>Guests</label>
                        <input type="number" id='guests' min="1"
                            value={guests} onChange={(e) => setGuests(e.target.value)}
                            className='max-w-30 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' />
                    </div>
                </div>

                <button type='submit' className='bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md max-md:w-full max-md:mt-6 md:px-25 py-3 md:py-4 text-base cursor-pointer'>
                    Book Now
                </button>
            </form>

            <div className='mt-25 space-y-4'>
                {roomCommonData.map((spec, index) => (
                    <div key={index} className='flex items-start gap-2'>
                        <img src={spec.icon} alt={`${spec.title}-icon`} className='w-6.5' />
                        <div>
                            <p className='text-base'>{spec.title}</p>
                            <p className='text-gray-500'>{spec.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className='max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500'>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque aspernatur ab reprehenderit laboriosam dignissimos sint vel.</p>
            </div>
        </div>
    )
}

export default RoomDetails