import React, { useEffect, useState, useMemo } from 'react'
import Title from '../../components/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { FaEye, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

const ITEMS_PER_PAGE = 10

const ManageBookings = () => {
  const [bookings, setBookings] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const { axios, getToken, user, currency } = useAppContext()

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/bookings/room', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })

      if (data.success) {
        setBookings(data.dashboardData?.bookings || [])
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const calculateDuration = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 'N/A'
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffMs = end - start
    const diffHours = Math.round(diffMs / (1000 * 60 * 60))
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`
  }

  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user])

  // Pagination logic
  const totalPages = Math.ceil(bookings.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedBookings = bookings.slice(startIndex, endIndex)

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  if (loading) {
    return (
      <div className='p-4 md:p-8 max-w-7xl mx-auto'>
        <div className='text-center py-8 text-gray-500'>Loading bookings...</div>
      </div>
    )
  }

  return (
    <div className='p-4 md:p-8 max-w-7xl mx-auto'>
      <Title align='left' font='outfit' title='Manage Bookings' />
      
      <h2 className='text-lg font-semibold text-gray-700 mt-6 mb-4'>All Bookings</h2>
      
      <div className='w-full shadow-2xl rounded-xl overflow-hidden border border-gray-100'>
        <div className='max-h-[70vh] overflow-y-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-100 sticky top-0 shadow-sm'>
              <tr>
                <th className='py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Booking ID</th>
                <th className='py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>User</th>
                <th className='py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider max-md:hidden'>Room Type</th>
                <th className='py-4 px-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider'>Date</th>
                <th className='py-4 px-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider max-md:hidden'>Time</th>
                <th className='py-4 px-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider'>Duration</th>
                <th className='py-4 px-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider'>Guests</th>
                <th className='py-4 px-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider'>Amount</th>
                <th className='py-4 px-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider'>Status</th>
              </tr>
            </thead>
            
            <tbody className='bg-white divide-y divide-gray-100 text-sm'>
              {paginatedBookings.length > 0 ? (
                paginatedBookings.map((booking) => (
                  <tr key={booking._id} className='hover:bg-blue-50 transition-colors duration-100'>
                    <td className='py-3 px-4 text-gray-800 font-mono text-xs whitespace-nowrap'>
                      {booking.referenceId || booking._id.slice(-8)}
                    </td>
                    
                    <td className='py-3 px-4 text-gray-800 font-medium whitespace-nowrap'>
                      {booking.user?.username || booking.user?.name || 'Guest User'}
                    </td>
                    
                    <td className='py-3 px-4 text-gray-500 max-md:hidden whitespace-nowrap'>
                      {booking.property?.roomType || 'N/A'}
                    </td>
                    
                    <td className='py-3 px-4 text-gray-700 text-center whitespace-nowrap'>
                      {formatDate(booking.checkInDate)}
                    </td>
                    
                    <td className='py-3 px-4 text-gray-500 text-center max-md:hidden whitespace-nowrap'>
                      {formatTime(booking.checkInDate)}
                    </td>
                    
                    <td className='py-3 px-4 text-gray-700 text-center whitespace-nowrap'>
                      {calculateDuration(booking.checkInDate, booking.checkOutDate)}
                    </td>
                    
                    <td className='py-3 px-4 text-gray-700 text-center whitespace-nowrap'>
                      {booking.guests || 'N/A'}
                    </td>
                    
                    <td className='py-3 px-4 text-gray-700 font-semibold text-center whitespace-nowrap'>
                      {currency}{booking.totalPrice || 0}
                    </td>
                    
                    <td className='py-3 px-4 text-center'>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.isPaid
                          ? 'bg-green-100 text-green-700 border border-green-300'
                          : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                      }`}>
                        {booking.isPaid ? (
                          <>
                            <FaCheckCircle className='text-xs' />
                            Paid
                          </>
                        ) : (
                          <>
                            <FaTimesCircle className='text-xs' />
                            Pending
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-gray-500 text-base">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200'>
            <div className='text-sm text-gray-700'>
              Showing {startIndex + 1} to {Math.min(endIndex, bookings.length)} of {bookings.length} bookings
            </div>
            <div className='flex gap-2'>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className='px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Previous
              </button>
              <div className='flex gap-1'>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let page
                  if (totalPages <= 5) {
                    page = i + 1
                  } else if (currentPage <= 3) {
                    page = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i
                  } else {
                    page = currentPage - 2 + i
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-1 text-sm border rounded ${
                        currentPage === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
              </div>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className='px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageBookings

