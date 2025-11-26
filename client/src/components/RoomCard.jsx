import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets.js';

const RoomCard = ({ room, index }) => {

  // Create robust Date objects from MongoDB strings
  const startDate = new Date(room.discountStartDate);
  const endDate = new Date(room.discountEndDate);
  const now = new Date();

  // 1. Calculate discount validity (using .getTime() for robust comparison)
  const hasActiveDiscount = room.discountPercent > 0 &&
    room.discountStartDate &&
    room.discountEndDate &&
    now.getTime() >= startDate.getTime() && 
    now.getTime() <= endDate.getTime();    

  const discountedPrice = hasActiveDiscount
    ? room.pricePerHour * (1 - room.discountPercent / 100)
    : room.pricePerHour;

  // 2. Helper to calculate "Time Left" string
  const calculateTimeLeft = () => {
    if (!hasActiveDiscount) return null;
    
    const diff = endDate.getTime() - now.getTime();

    // Convert milliseconds to days/hours/minutes
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);

    if (days > 0) return `${days} days left`;
    if (hours > 0) return `${hours} hrs left`;
    if (minutes > 0) return `${minutes} mins left`;
    return 'Ending soon!';
  };

  const timeLeft = calculateTimeLeft();

  return (
    <Link 
      to={'/rooms/' + room._id} 
      onClick={() => scrollTo(0, 0)} 
      key={room._id} 
      className='relative max-70 w-100 rounded-xl overflow-hidden bg-white text-gray-500/90 shadow-[0px_4px_4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-shadow duration-300'
    >
      <div className="relative">
        <img src={room.images[0]} alt="" className='w-100 h-60 object-cover' />

        {/* Best Seller Badge */}
        {index % 2 === 0 && (
          <p className='px-3 py-1 absolute top-3 left-3 text-xs bg-white text-gray-800 font-medium rounded-full shadow-sm'>
            Best Seller
          </p>
        )}

        {/* Discount Badge */}
        {hasActiveDiscount && (
          <p className='px-3 py-1 absolute top-3 right-3 text-xs bg-red-500 text-white font-bold rounded-full shadow-sm'>
            {room.discountPercent}% OFF
          </p>
        )}
      </div>

      <div className='p-4 pt-5'>
        <div className='flex items-center justify-between'>
          <p className='font-playfair text-xl font-medium text-gray-800'>{room.name}</p>
          <div className='flex items-center gap-1'>
            <img src={assets.starIconFilled} alt="star-icon" />4.5
          </div>
        </div>

        <div className='flex items-center justify-between mt-4'>
          <div className='flex flex-col'>
            
            <div className='flex items-center gap-2'>
              {hasActiveDiscount && (
                <span className='text-sm text-gray-400 line-through'>
                  ₱{room.pricePerHour}
                </span>
              )}
              <p>
                <span className={`text-xl ${hasActiveDiscount ? 'text-red-500 font-semibold' : 'text-gray-800'}`}>
                  ₱{discountedPrice.toFixed(2)}
                </span>
                /hour
              </p>
            </div>

            {/* COUNTDOWN TIMER DISPLAY */}
            {hasActiveDiscount && timeLeft && (
               <p className='text-xs text-red-500 font-medium flex items-center gap-1 mt-1'>
                 ⏱ Ends in {timeLeft}
               </p>
            )}

          </div>
          
          <button className='px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50 transition-all cursor-pointer h-fit self-end'>
            Book Now
          </button>
        </div>
      </div>
    </Link>
  )
}

export default RoomCard