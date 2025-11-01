import React from 'react'
import RoomCard from './RoomCard.jsx'
import { roomsDummyData } from '../assets/assets'
import Title from './Title.jsx'
import { useNavigate } from 'react-router-dom'

const FeaturedRoom = () => {
    const navigate = useNavigate();

    return (
        <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>

            <Title title='Featured Rooms' subTitle="We've paired our incredible rooms with featured movies and games that'll transport you to another world. Whether you're a gamer on a quest or a cinephile looking for a scene change, your next adventure starts here." />

            <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
                {roomsDummyData.slice(0, 3).map((room, index) => (
                    <RoomCard key={room._id} room={room} index={index} />
                ))}
            </div>

            <button onClick={() => { navigate('/rooms'); scrollTo(0,0)}}
                className='my-16 px-4 py-2 text-sm font-medium border border-grey-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer'>
                View All Rooms
            </button>
        </div>
    )
}

export default FeaturedRoom
