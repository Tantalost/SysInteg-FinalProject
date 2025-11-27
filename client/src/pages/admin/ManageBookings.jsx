import React, { useEffect, useState, useMemo } from 'react'
import Title from '../../components/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { FaCheckCircle, FaTimesCircle, FaTimes } from 'react-icons/fa'

const ITEMS_PER_PAGE = 10

const ManageBookings = () => {
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const { axios, getToken, user, currency } = useAppContext()

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/bookings/room', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })

      if (data.success) {
        const bookingsData = data.dashboardData?.bookings || []
        setBookings(bookingsData)
        setFilteredBookings(bookingsData)
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

  const applyFilters = () => {
    let filtered = [...bookings]

    // Apply time filter
    if (selectedFilter !== 'all') {
      const now = new Date()
      let startDate
      
      if (selectedFilter === 'week') {
        const dayOfWeek = now.getDay()
        startDate = new Date(now)
        startDate.setDate(now.getDate() - dayOfWeek)
        startDate.setHours(0, 0, 0, 0)
      } else if (selectedFilter === 'month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      } else if (selectedFilter === 'year') {
        startDate = new Date(now.getFullYear(), 0, 1)
      }

      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.createdAt || booking.checkInDate)
        return bookingDate >= startDate
      })
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(booking => {
        const bookingId = (booking.referenceId || booking._id).toLowerCase()
        return bookingId.includes(query)
      })
    }

    return filtered
  }

  const handleSearch = () => {
    const filtered = applyFilters()
    if (filtered.length === 0 && searchQuery.trim()) {
      toast.error('No booking found with that ID')
    } else if (filtered.length === 1 && searchQuery.trim()) {
      setSelectedBooking(filtered[0])
      setShowDetailsModal(true)
    }
  }

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter)
  }

  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user])

  useEffect(() => {
    if (bookings.length > 0) {
      const filtered = applyFilters()
      setFilteredBookings(filtered)
      setCurrentPage(1)
    } else {
      setFilteredBookings([])
    }
  }, [selectedFilter, searchQuery, bookings])

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedBookings = filteredBookings.slice(startIndex, endIndex)

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
      
      {/* Search and Filter Section */}
      <div className='mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between'>
        <div className='flex flex-col md:flex-row gap-3 flex-1'>
          <div className='flex gap-2'>
            <input
              type="text"
              placeholder="Search by Booking ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <button
              onClick={handleSearch}
              className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'
            >
              Search
            </button>
          </div>
          
          <div className='flex gap-2'>
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-2 rounded-lg transition ${
                selectedFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange('week')}
              className={`px-4 py-2 rounded-lg transition ${
                selectedFilter === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => handleFilterChange('month')}
              className={`px-4 py-2 rounded-lg transition ${
                selectedFilter === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => handleFilterChange('year')}
              className={`px-4 py-2 rounded-lg transition ${
                selectedFilter === 'year'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              This Year
            </button>
          </div>
        </div>
      </div>
      
      <div className='w-full shadow-2xl rounded-xl overflow-hidden border border-gray-100'>
        <div className='max-h-[70vh] overflow-y-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-100 sticky top-0 shadow-sm'>
              <tr>
                <th className='py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Booking ID</th>
                <th className='py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>User</th>
                <th className='py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider max-md:hidden'>Room Type</th>
                <th className='py-4 px-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider'>Date</th>
                <th className='py-4 px-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider max-md:hidden'>Start Time</th>
                <th className='py-4 px-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider max-md:hidden'>End Time</th>
                <th className='py-4 px-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider'>Duration</th>
                <th className='py-4 px-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider max-md:hidden'>Created</th>
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
                      {booking.user?.email || 'Guest User'}
                    </td>
                    
                    <td className='py-3 px-4 text-gray-500 max-md:hidden whitespace-nowrap'>
                      {booking.room?.roomType || 'N/A'}
                    </td>
                    
                    <td className='py-3 px-4 text-gray-700 text-center whitespace-nowrap'>
                      {formatDate(booking.checkInDate)}
                    </td>
                    
                    <td className='py-3 px-4 text-gray-500 text-center max-md:hidden whitespace-nowrap'>
                      {formatTime(booking.checkInDate)}
                    </td>
                    
                    <td className='py-3 px-4 text-gray-500 text-center max-md:hidden whitespace-nowrap'>
                      {formatTime(booking.checkOutDate)}
                    </td>
                    
                    <td className='py-3 px-4 text-gray-700 text-center whitespace-nowrap'>
                      {calculateDuration(booking.checkInDate, booking.checkOutDate)}
                    </td>
                    
                    <td className='py-3 px-4 text-gray-500 text-center max-md:hidden whitespace-nowrap text-xs'>
                      {formatDate(booking.createdAt)}
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
                  <td colSpan="10" className="text-center py-8 text-gray-500 text-base">
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
              Showing {startIndex + 1} to {Math.min(endIndex, filteredBookings.length)} of {filteredBookings.length} bookings
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

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4'>
          <div className='bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-2xl font-bold text-gray-800'>Booking Details</h3>
              <button
                onClick={() => {
                  setShowDetailsModal(false)
                  setSelectedBooking(null)
                }}
                className='text-gray-500 hover:text-gray-800'
              >
                <FaTimes className='text-xl' />
              </button>
            </div>
            
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm text-gray-500'>Booking ID</p>
                  <p className='font-mono text-sm font-semibold'>{selectedBooking.referenceId || selectedBooking._id.slice(-8)}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Status</p>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedBooking.isPaid
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {selectedBooking.isPaid ? 'Paid' : 'Pending'}
                  </span>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>User</p>
                  <p className='font-medium'>{selectedBooking.user?.username || selectedBooking.user?.email || 'Guest'}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Email</p>
                  <p className='font-medium'>{selectedBooking.user?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Room Type</p>
                  <p className='font-medium'>{selectedBooking.room?.roomType || 'N/A'}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Guests</p>
                  <p className='font-medium'>{selectedBooking.guests || 'N/A'}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Check-in Date</p>
                  <p className='font-medium'>{formatDate(selectedBooking.checkInDate)}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Check-in Time</p>
                  <p className='font-medium'>{formatTime(selectedBooking.checkInDate)}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Check-out Date</p>
                  <p className='font-medium'>{formatDate(selectedBooking.checkOutDate)}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Check-out Time</p>
                  <p className='font-medium'>{formatTime(selectedBooking.checkOutDate)}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Duration</p>
                  <p className='font-medium'>{calculateDuration(selectedBooking.checkInDate, selectedBooking.checkOutDate)}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Total Amount</p>
                  <p className='font-bold text-lg'>{currency}{selectedBooking.totalPrice || 0}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Booking Created</p>
                  <p className='font-medium'>{formatDate(selectedBooking.createdAt)} {formatTime(selectedBooking.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageBookings

