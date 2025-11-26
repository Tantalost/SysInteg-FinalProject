import React, { useState } from 'react'
import { assets } from '../assets/assets.js';
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext.jsx';

const Hero = () => {

    const { getToken, axios, setSearchedRoomTypes} = useAppContext();
    const [roomTypes, setRoomTypes] = useState([])
    const [selectedRoomType, setSelectedRoomType] = useState('')
    const navigate = useNavigate();


    return (
        <div className='flex flex-col items-start justify-center px-6
    md:px-16 lg:px-24 xl:px-32 text-white bg-[url("/src/assets/hero-bg.jpg")] bg-no-repeat bg-cover bg-center h-screen'>
            <h1 className='font-sans serif text-2xl md:text-5xl md:text-[56px] md:leading-[56px] font-bold md:font-extrabold max-w-xl mt-4'>Skip the waiting and guarantee your spot!</h1>
            <p className='max-w-130 mt-2 text-sm md:text-base'>The Fastest Way to Fun. Book Your Private Movie, Karaoke, or Gaming Room Instantly.</p>

            <form 
                onSubmit={(e) => {
                    e.preventDefault()
                    if (selectedRoomType) {
                        navigate(`/services?roomType=${encodeURIComponent(selectedRoomType)}`)
                    }
                }}
                className='bg-white text-gray-500 rounded-lg px-6 py-4 mt-8 flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto'
            >
                <div className='flex-1'>
                    <div className='flex items-center gap-2'>
                        <img src={assets.calendarIcon} alt="calendarIcon" className='h-4' />
                        <label htmlFor="roomTypeInput">Room Type</label>
                    </div>
                    <select
                        id="roomTypeInput"
                        className="w-full rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
                        required
                        value={selectedRoomType}
                        onChange={(e) => setSelectedRoomType(e.target.value)}
                    >
                        <option value="" disabled>
                            Select a room type
                        </option>
                        <option value="Gaming Room">Gaming Room</option>
                        <option value="KTV Room">KTV Room</option>
                        <option value="Movie Room">Movie Room</option>
                    </select>
                </div>

                <button 
                    type="submit"
                    className='flex items-center justify-center gap-1 rounded-md bg-black py-3 px-4 text-white my-auto cursor-pointer max-md:w-full max-md:py-1 hover:bg-gray-800 transition' 
                >
                    <img src={assets.searchIcon} alt="searchIcon" className='h-7' />
                    <span>Search</span>
                </button>
            </form>
        </div>
    )
}

export default Hero
