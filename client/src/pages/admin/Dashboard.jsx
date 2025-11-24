import React, { useEffect, useState } from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'

const Dashboard = () => {

    const { currency, user, getToken, toast, axios } = useAppContext();

    const [dashboardData, setDashboardData] = useState({
        bookings: [],
        totalBookings: 0,
        totalRevenue: 0,
    })

    const fetchDashboardData = async () => {
        try {
            // FIX 1: Changed endpoint from '/api/bookings/properties' to '/api/bookings/room'
            // Ensure this matches your route definition in server.js
            const { data } = await axios.get('/api/bookings/room', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })

            if (data.success) {
                setDashboardData(data.dashboardData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            // Safe error handling to prevent "reading 'error' of undefined"
            console.error(error);
            toast.error(error.response?.data?.message || error.message || "Failed to fetch dashboard data");
        }
    }

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user])

    return (
        <div>
            <Title align="left" font='outfit' title='Dashboard' />

            <div className='flex gap-4 my-8'>
                <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
                    <img src={assets.totalBookingIcon} alt="" className='max-sm:hidden h-10' />
                    <div className='flex flex-col sm:ml-4 font-medium'>
                        <p className='text-red-500 text-lg'>Total Bookings</p>
                        <p className='text-neutral-400 text-base'>{dashboardData.totalBookings}</p>
                    </div>
                </div>

                <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
                    <img src={assets.totalRevenueIcon} alt="" className='max-sm:hidden h-10' />
                    <div className='flex flex-col sm:ml-4 font-medium'>
                        <p className='text-red-500 text-lg'>Total Revenue</p>
                        <p className='text-neutral-400 text-base'>₱ {dashboardData.totalRevenue}</p>
                    </div>
                </div>
            </div>

            <h2 className='text-xl text-red-950/70 font-medium mb-5'>Recent Bookings</h2>
            <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll'>
                {/* FIX 2: Changed <table w-full> to className */}
                <table className='w-full'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='py-3 px-4 text-gray-800 font-medium'>User Name</th>
                            <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Room Type</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Total Amount</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Payment Status</th>

                        </tr>
                    </thead>
                    <tbody className='text-sm'>
                        {/* Check if bookings exist */}
                        {dashboardData.bookings && dashboardData.bookings.length > 0 ? (
                            dashboardData.bookings.map((item, index) => (
                                <tr key={index}>
                                    <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                                        {/* Optional chaining for user */}
                                        {item.user?.name || 'Guest'}
                                    </td>
                                    <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>
                                        {/* FIX 3: Optional chaining for room + use 'name' instead of 'roomType' */}
                                        {item.room?.name || item.room?.roomNumber || 'Room Deleted'}
                                    </td>
                                    <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>
                                        {currency} {item.totalPrice}
                                    </td>
                                    <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                                        <button className={`py-1 px-3 text-xs rounded-full mx-auto ${item.isPaid ? 'bg-green-200 text-green-600' : 'bg-amber-200 text-yellow-600'}`}>
                                            {item.isPaid ? `Completed` : `Pending`}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className='p-4 text-center'>No bookings found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Dashboard