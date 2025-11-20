import React, { useState } from 'react'
import { assets, roomTypes } from '../assets/assets'
import { useAppContext } from '../context/AppContext.jsx'
import { toast } from 'react-hot-toast'

const RoomReg = () => {

    const { setShowRoomReg, axios, getToken, setIsAdmin } = useAppContext();

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [roomType, setRoomType] = useState('');

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();
            const { data } = await axios.post(`/api/rooms/`, { name, address, roomType }, {
                headers: {
                    Authorization: `Bearer ${await getToken()}`
                }})

            if (data.success) {
                toast.success('Room registered successfully');
                setIsAdmin(true)
                setShowRoomReg(false);
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div onClick={() => setShowRoomReg(false)} className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center 
        justify-center bg-black/70'>
            <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()} className='flex bg-white rounded-xl max-w-4xl max-md:mx-2'>
                <img src={assets.regImage} alt="regImage" className='w-1/2  hidden md:block' />
                <div className='relative flex flex-col items-center md:w-1/2 p-8 md:p-10'>
                    <img src={assets.closeIcon} alt="closeIcon" className='absolute top-4 right-4 h-4 w-4 cursor-pointer' onClick={() => setShowRoomReg(false)} />
                    <p className='text-2xl font-semibold mt-6'>Register Your Room</p>

                    <div className='w-full mt-4'>
                        <label htmlFor="name" className='font-medium text-gray-500'>
                            Room Name
                        </label>
                        <input id='name' onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='Type Here' className='border
                        border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-ligt required   ' />
                    </div>

                    <div className='w-full mt-4'>
                        <label htmlFor="address" className='font-medium text-gray-500'>
                            Address
                        </label>
                        <input id='address' onChange={(e) => setAddress(e.target.value)} value={address} type="text" placeholder='Type Here' className='border
                        border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-ligt required   ' />
                    </div>

                    <div className='w-full mt-4 max-w-60 mr-auto'>
                        <label htmlFor="roomType" className='font-medium text-gray-500'>Room Type</label>
                        <select id="roomType" onChange={(e) => setRoomType(e.target.value)} value={roomType} className='className="border border-red-200
                        rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light required'>
                            <option value="">Select Room</option>
                            {roomTypes.map((rooms) => (
                                <option key={rooms} values={rooms}>{rooms}</option>
                            ))}
                        </select>
                    </div>
                    <button className='bg-red-500 hover:bg-red-600 transition-all
                    text-white mr-auto px-6 py-2 rounded cursor-pointer mt-6'>Register
                    </button>
                </div>

            </form>
        </div>
    )
}

export default RoomReg
