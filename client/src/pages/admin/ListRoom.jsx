import React, { useEffect, useState } from 'react'
import Title from '../../components/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ListRoom = () => {

  const [rooms, setRooms] = useState([])
  const { axios, getToken, user, currency } = useAppContext()

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get('/api/properties/admin', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })

      if (data.success) {

        setRooms(data.properties) 
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const toggleAvailability = async (id) => {
    try {
     
      const { data } = await axios.post('/api/properties/toggle-availability',
        { propertyId: id }, 
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      )
      
      if (data.success) {
        toast.success(data.message);
        fetchRooms(); 
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if (user) {
      fetchRooms()
    }
  }, [user])

  return (
    <div className='p-4 md:p-8 max-w-7xl mx-auto'>
    <Title align='left' font='outfit' title='Manage Room Properties' />
    
    <h2 className='text-lg font-semibold text-gray-700 mt-6 mb-4'>All Listed Rooms</h2>
    
    {/* --- Table Container (Enhanced Styling) --- */}
    <div className='w-full shadow-2xl rounded-xl overflow-hidden border border-gray-100'>
        {/* max-h-[70vh] gives a fixed max height and scrollbar for long lists */}
        <div className='max-h-[70vh] overflow-y-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
                {/* Table Header: Sticky and Cleaner */}
                <thead className='bg-gray-100 sticky top-0 shadow-sm'>
                    <tr>
                        <th className='py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Room Type</th>
                        {/* Renamed Facility to Amenities for clarity, hidden on small screens */}
                        <th className='py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider max-md:hidden'>Amenities</th>
                        {/* Changed Price/night to Price/hour for consistency */}
                        <th className='py-4 px-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider'>Price / hour</th> 
                        <th className='py-4 px-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider'>Availability</th>
                    </tr>
                </thead>
                
                {/* Table Body: Cleaner Separators and Hover Effect */}
                <tbody className='bg-white divide-y divide-gray-100 text-sm'>
                    {rooms && rooms.length > 0 ? (
                        rooms.map((item, index) => (
                            <tr key={index} className='hover:bg-blue-50 transition-colors duration-100'>
                                {/* Room Type */}
                                <td className='py-3 px-4 text-gray-800 font-medium whitespace-nowrap'>
                                    {item.roomType}
                                </td>
                                
                                {/* Amenities (Hidden on small screens) */}
                                <td className='py-3 px-4 text-gray-500 max-md:hidden text-ellipsis overflow-hidden max-w-[200px]'>
                                    {item.amenities?.join(', ') || 'N/A'}
                                </td>
                                
                                {/* Price */}
                                <td className='py-3 px-4 text-gray-700 font-semibold text-center whitespace-nowrap'>
                                    {/* Using a helper function (formatCurrency) is recommended here for clarity */}
                                    {currency}{item.pricePerHour} 
                                </td>
                                
                                {/* Actions / Availability Toggle */}
                                <td className='py-3 px-4 text-center'>
                                    {/* Cleaned up the toggle switch for a more standard look */}
                                    <label className='relative inline-flex items-center cursor-pointer'>
                                        <input 
                                            onChange={() => toggleAvailability(item._id)} 
                                            type="checkbox" 
                                            className='sr-only peer' 
                                            checked={item.isAvailable} 
                                        />
                                        {/* Visual Toggle Switch */}
                                        <div className='w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600 transition-colors duration-200'></div>
                                        {/* Availability Status Text (Optional, but good UX) */}
                                        <span className={`ms-3 text-sm font-medium ${item.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                                            {item.isAvailable ? 'Active' : 'Hidden'}
                                        </span>
                                    </label>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center py-8 text-gray-500 text-base">
                                No rooms found. Please add a new room.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
</div>
  )
}

export default ListRoom