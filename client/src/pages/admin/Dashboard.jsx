import React, { useEffect, useState } from 'react';
import Title from '../../components/Title';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
// Assuming 'toast' is from react-hot-toast, which you used previously
import toast from 'react-hot-toast'; 

const Dashboard = () => {
    const { currency, user, getToken, axios } = useAppContext();
    const [dashboardData, setDashboardData] = useState({
        bookings: [],
        totalBookings: 0,
        totalRevenue: 0,
        totalUsers: 0, 
    });
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Helper function to format currency for cleaner display.
     */
    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return `${currency} 0.00`;
        const currencyCode = currency === '₱' ? 'PHP' : 'USD';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currencyCode,
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const token = await getToken();
            
            // Fetch bookings
            const bookingsResponse = await axios.get('/api/bookings/room', {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Fetch total users count
            const usersResponse = await axios.get('/api/user/count', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (bookingsResponse.data.success) {
                const totalUsers = usersResponse.data.success ? (usersResponse.data.count || 0) : 0;
                
                setDashboardData(prev => ({
                    ...prev,
                    ...bookingsResponse.data.dashboardData,
                    totalUsers
                }));
            } else {
                toast.error(bookingsResponse.data.message);
            }
        } catch (error) {
            console.error(error);
            // If users endpoint doesn't exist, just use bookings data
            try {
                const { data } = await axios.get('/api/bookings/room', {
                    headers: { Authorization: `Bearer ${await getToken()}` }
                });
                if (data.success) {
                    setDashboardData(prev => ({
                        ...prev,
                        ...data.dashboardData,
                        totalUsers: 0
                    }));
                }
            } catch (err) {
                toast.error(error.response?.data?.message || error.message || "Failed to fetch dashboard data");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    if (isLoading) {
        return (
            <div className='p-8 text-center text-xl text-gray-500'>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className='p-4 md:p-8 max-w-7xl mx-auto'>
            <Title align="left" font='outfit' title='Admin Dashboard' />

            {/* --- STATS CARDS CONTAINER (Maximized UI/UX) --- */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8'>
                
                {/* 1. Total Bookings Card (Blue/Primary Focus) */}
                <StatsCard 
                    title="Total Bookings" 
                    value={dashboardData.totalBookings}
                    iconSrc={assets.totalBookingIcon}
                    valueClass="text-blue-600"
                />

                {/* 2. Total Revenue Card (Green/Success Focus) */}
                <StatsCard 
                    title="Total Revenue" 
                    value={formatCurrency(dashboardData.totalRevenue)}
                    iconSrc={assets.totalRevenueIcon}
                    valueClass="text-green-600"
                />

                {/* 3. Total Users Card (Neutral/User Focus - ICON FIXED) */}
                <StatsCard 
                    title="Total Users" 
                    value={dashboardData.totalUsers} // Using dummy value 123
                    iconSrc={assets.userIcon}
                    valueClass="text-gray-800"
                />
            </div>
            
            {/* --- RECENT BOOKINGS TABLE (Maximized UI/UX) --- */}
            <h2 className='text-2xl font-bold text-gray-800 mb-5 mt-10 border-b pb-2'>
                Recent Bookings
            </h2>
            <div className='w-full shadow-2xl rounded-xl overflow-hidden border border-gray-100'>
                <div className='max-h-[60vh] overflow-y-auto'>
                    <table className='min-w-full divide-y divide-gray-200'>
                        <thead className='bg-gray-100 sticky top-0 shadow-sm'>
                            <tr>
                                <TableHeader title="Booking ID" align="left" />
                                <TableHeader title="User Email" align="left" />
                                <TableHeader title="Room Type" align="left" className="max-sm:hidden" />
                                <TableHeader title="Date" align="center" />
                                <TableHeader title="Duration" align="center" className="max-md:hidden" />
                                <TableHeader title="Amount" align="center" />
                                <TableHeader title="Status" align="center" />
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-100 text-sm'>
                            {dashboardData.bookings && dashboardData.bookings.length > 0 ? (
                                dashboardData.bookings.slice(0, 5).map((item) => {
                                    const checkIn = new Date(item.checkInDate);
                                    const checkOut = new Date(item.checkOutDate);
                                    const durationHours = Math.round((checkOut - checkIn) / (1000 * 60 * 60));
                                    
                                    return (
                                        <tr key={item._id} className='hover:bg-blue-50 transition-colors duration-100'>
                                            <td className='py-3 px-4 whitespace-nowrap text-gray-800 font-mono text-xs'>
                                                {item.referenceId || item._id.slice(-8)}
                                            </td>
                                            <td className='py-3 px-4 whitespace-nowrap text-gray-800 font-medium'>
                                                {item.user?.email || 'Guest User'}
                                            </td>
                                            <td className='py-3 px-4 whitespace-nowrap text-gray-500 max-sm:hidden'>
                                                {item.room?.roomType || 'N/A'}
                                            </td>
                                            <td className='py-3 px-4 whitespace-nowrap text-gray-700 text-center'>
                                                {checkIn.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td className='py-3 px-4 whitespace-nowrap text-gray-700 text-center max-md:hidden'>
                                                {durationHours} hour{durationHours !== 1 ? 's' : ''}
                                            </td>
                                            <td className='py-3 px-4 whitespace-nowrap text-gray-700 font-semibold text-center'>
                                                {formatCurrency(item.totalPrice)}
                                            </td>
                                            <td className='py-3 px-4 whitespace-nowrap text-center'>
                                                <StatusBadge isPaid={item.isPaid} />
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="7" className='p-6 text-center text-gray-500 text-base'>
                                        No recent bookings found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;

// --- Helper Components for better UI/UX and Code Readability ---

const StatsCard = ({ title, value, iconSrc, valueClass }) => (
    <div className='flex items-center bg-white shadow-xl rounded-2xl p-6 transition-all duration-300 transform hover:scale-[1.02]'>
        {/* Icon: Slightly larger, rounded background for better visual focus */}
        <div className='p-3 bg-gray-100 rounded-full mr-4 flex-shrink-0'>
            <img src={iconSrc} alt={title} className='h-8 w-8 opacity-80' />
        </div>
        <div className='flex flex-col'>
            <p className='text-gray-500 text-sm uppercase font-semibold tracking-wider'>
                {title}
            </p>
            <p className={`text-4xl font-extrabold ${valueClass}`}>
                {value}
            </p>
        </div>
    </div>
);

const StatusBadge = ({ isPaid }) => (
    <span className={`py-1.5 px-4 text-xs font-bold rounded-full inline-block ${
        isPaid 
            ? 'bg-green-100 text-green-700 border border-green-300' 
            : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
    }`}>
        {isPaid ? `COMPLETED` : `PENDING`}
    </span>
);

const TableHeader = ({ title, align, className }) => (
    <th className={`py-3 px-4 text-${align} text-xs font-bold text-gray-700 uppercase tracking-wider ${className}`}>
        {title}
    </th>
);