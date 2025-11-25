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

            <form className='bg-white text-gray-500 rounded-lg px-6 py-4 mt-8 flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto'>

                <div>
                    <div className='flex items-center gap-2'>
                        <img src={assets.calendarIcon} alt="calendarIcon" className='h-4' />
                        <label htmlFor="roomTypeInput">Room Type</label>
                    </div>
                    <select
                        list='roomType'
                        id="roomTypeInput"
                        className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
                        placeholder="Select a room"
                        required
                        value={selectedRoomType}
                        onChange={(e) => setSelectedRoomType(e.target.value)}
                    >
                        <option value="" disabled>
                            Select a room
                        </option>
                        {roomTypes.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <div className='flex items-center gap-2'>
                        <img src={assets.calendarIcon} alt="calendarIcon" className='h-4' />
                        <label htmlFor="checkIn">Check in</label>
                    </div>
                    <input id="checkIn" type="date" className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" />
                </div>

                <div>
                    <div className='flex items-center gap-2'>
                        <img src={assets.calendarIcon} alt="calendarIcon" className='h-4' />
                        <label htmlFor="duration">Duration (hours)</label>
                    </div>
                    <input id="duration" type="number" min="1" max="12" step="1" className="w-full rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" placeholder='Enter hours' required/>
                </div>

                <div className='flex md:flex-col max-md:gap-2 max-md:items-center'>
                    <label htmlFor="guests">Guests</label>
                    <input min={1} max={4} id="guests" type="number" className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none  max-w-16" placeholder="0" />
                </div>

                <button className='flex items-center justify-center gap-1 rounded-md bg-black py-3 px-4 text-white my-auto cursor-pointer max-md:w-full max-md:py-1' >
                    <img src={assets.searchIcon} alt="searchIcon" className='h-7' />
                    <span>Search</span>
                </button>
            </form>
        </div>
    )
}

export default Hero
