import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { facilityIcons, roomCommonData } from '../assets/assets' 
import Ratings from '../components/Ratings'
import AmenityIcon from '../components/AmenityIcon'
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
    const [startTime, setStartTime] = useState(''); // This stores the selected time string (e.g., "14:00")

    // Availability States
    const [bookedRanges, setBookedRanges] = useState([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    useEffect(() => {
        const fetchAvailability = async () => {
            if (!checkInDate || !id) return;

            setIsLoadingSlots(true);
            setBookedRanges([]); 
            setStartTime(''); 

            try {
                const { data } = await axios.get(`/api/bookings/availability?roomId=${id}&date=${checkInDate}`);
                if (data.success) {
                    setBookedRanges(data.bookedRanges);
                }
            } catch (error) {
                console.error("Failed to fetch availability", error);
            } finally {
                setIsLoadingSlots(false);
            }
        };

        fetchAvailability();
    }, [checkInDate, id]);

    // to check if a specific time slot is booked
    const isSlotBooked = (timeString) => {
    if (!checkInDate || bookedRanges.length === 0) return false;
    const currentSlotDate = new Date(`${checkInDate}T${timeString}:00.000Z`);

    
    const currentSlotHour = currentSlotDate.getUTCHours();


    return bookedRanges.some(range => {
        const rangeStart = new Date(range.start);
        const rangeEnd = new Date(range.end);

        const startHourUTC = rangeStart.getUTCHours();
        const endHourUTC = rangeEnd.getUTCHours();

        return currentSlotHour >= startHourUTC && currentSlotHour < endHourUTC;
    });
};

    const generateTimeSlots = () => {
        const slots = [];
        let startHour = 8;
        let endHour = 22;

        for (let i = startHour; i <= endHour; i++) {
            const timeString = `${i.toString().padStart(2, '0')}:00`;
            slots.push(timeString);
        }
        return slots;
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error("You must be logged in to book.");
            return;
        }
        if (!startTime) {
            toast.error("Please select a start time.");
            return;
        }

        try {
            const token = await getToken();
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
                toast.success(data.message || "Booking Successful!");
                navigate('/my-bookings');
                window.scrollTo(0, 0);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
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

    useEffect(() => {
        if (bookedRanges.length > 0) {
            console.log("=== DEBUGGING BOOKING ===");
            console.log("DB Range (Raw):", bookedRanges[0]);
            console.log("DB Range Start (Parsed):", new Date(bookedRanges[0].start).toISOString());

            const testSlot = new Date(`${checkInDate}T08:00:00.000Z`);
            console.log("Test Slot 08:00 (ISO):", testSlot.toISOString());
        }
    }, [bookedRanges, checkInDate]);

    if (!selectedProperty) {
        return <div className='min-h-screen flex justify-center items-center'>Loading...</div>
    }
    return (
        <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>
            <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
                <h1 className='text-3xl md:text-4xl font-playfair'>
                    {selectedProperty.roomType}
                </h1>
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

            <div className='flex flex-col md:flex-row md:justify-between mt-10'>
                <div className='flex flex-col'>
                    <h1 className='text-3xl md:text-4xl font-playfair'>Experience Entertainment Like Never Before</h1>
                    <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                        {selectedProperty.amenities.map((item, index) => (
                            <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100'>
                                <AmenityIcon amenity={item} className='w-5 h-5 text-gray-700' />
                                <p className='text-xs'>{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='flex flex-col items-end'>
                    {(() => {
                        const now = new Date()
                        const hasActiveDiscount = selectedProperty.discountPercent > 0 &&
                            selectedProperty.discountStartDate &&
                            selectedProperty.discountEndDate &&
                            now >= new Date(selectedProperty.discountStartDate) &&
                            now <= new Date(selectedProperty.discountEndDate)
                        
                        const discountedPrice = hasActiveDiscount
                            ? selectedProperty.pricePerHour * (1 - selectedProperty.discountPercent / 100)
                            : selectedProperty.pricePerHour
                        
                        return (
                            <>
                                {hasActiveDiscount && (
                                    <p className='text-sm text-gray-400 line-through'>
                                        {currency}{selectedProperty.pricePerHour}
                                    </p>
                                )}
                                <p className='text-2xl font-medium'>
                                    {currency}{discountedPrice.toFixed(2)}<span className='text-sm text-gray-500'>/hour</span>
                                </p>
                                {hasActiveDiscount && (
                                    <p className='text-xs text-orange-500 font-semibold'>
                                        {selectedProperty.discountPercent}% OFF
                                    </p>
                                )}
                            </>
                        )
                    })()}
                </div>
            </div>

            <form onSubmit={onSubmitHandler} className='flex flex-col bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl'>

                <div className='flex flex-col md:flex-row justify-between gap-6 mb-6'>
                    <div className='flex flex-col w-full md:w-1/3'>
                        <label htmlFor="checkInDate" className='font-medium text-gray-600 mb-2'>Select Date</label>
                        <input
                            type="date"
                            id='checkInDate'
                            required
                            value={checkInDate}
                            min={new Date().toISOString().split('T')[0]} 
                            onChange={(e) => setCheckInDate(e.target.value)}
                            className='w-full rounded-lg border border-gray-300 px-4 py-3 outline-orange-500'
                        />
                    </div>

                    <div className='flex gap-4 w-full md:w-1/3'>
                        <div className='flex flex-col w-1/2'>
                            <label className='font-medium text-gray-600 mb-2'>Duration (Hrs)</label>
                            <input type="number" min="1" max="8"
                                value={duration} onChange={(e) => setDuration(e.target.value)}
                                className='w-full rounded-lg border border-gray-300 px-4 py-3 outline-orange-500' />
                        </div>
                        <div className='flex flex-col w-1/2'>
                            <label className='font-medium text-gray-600 mb-2'>Guests</label>
                            <input type="number" min="1" max="5"
                                value={guests} onChange={(e) => setGuests(e.target.value)}
                                className='w-full rounded-lg border border-gray-300 px-4 py-3 outline-orange-500' />
                        </div>
                    </div>
                </div>

                <div className='mb-8'>
                    <label className='font-medium text-gray-600 mb-3 block'>
                        Select Start Time
                        {isLoadingSlots && <span className='text-sm text-orange-500 ml-2'>(Loading availability...)</span>}
                    </label>

                    {!checkInDate ? (
                        <p className='text-gray-400 text-sm italic'>Please select a date to see available times.</p>
                    ) : (
                        <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3'>
                            {generateTimeSlots().map((slot) => {
                                const isBooked = isSlotBooked(slot);
                                const isSelected = startTime === slot;

                                return (
                                    <button
                                        key={slot}
                                        type="button" 
                                        disabled={isBooked}
                                        onClick={() => setStartTime(slot)}
                                        className={`
                                                py-2 px-2 rounded-lg text-sm font-medium border transition-all
                                                ${isBooked
                                                ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed line-through'
                                                : isSelected
                                                    ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:border-orange-500 hover:text-orange-500'
                                            }
`}
                                    >
                                        {slot}
                                    </button>
                                )
                            })}
                        </div>
                    )}
                    {checkInDate && (
                        <div className='flex gap-4 mt-3 text-xs text-gray-500'>
                            <div className='flex items-center gap-1'><div className='w-3 h-3 bg-white border border-gray-300 rounded'></div> Available</div>
                            <div className='flex items-center gap-1'><div className='w-3 h-3 bg-orange-500 rounded'></div> Selected</div>
                            <div className='flex items-center gap-1'><div className='w-3 h-3 bg-gray-200 border border-gray-300 rounded'></div> Booked</div>
                        </div>
                    )}
                </div>

                <button type='submit' className='w-full bg-primary hover:bg-orange-600 active:scale-95 transition-all text-white rounded-lg py-4 font-semibold text-lg shadow-lg'>
                    Book Room
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
        </div>
    )
}

export default RoomDetails