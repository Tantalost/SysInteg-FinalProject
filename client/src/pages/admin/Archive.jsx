import React, { useEffect, useMemo, useState } from 'react'
import Title from '../../components/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { FaUndo } from 'react-icons/fa'

const Archive = () => {

  const [rooms, setRooms] = useState([])
  const [restoringId, setRestoringId] = useState(null)
  const { axios, getToken, user, currency } = useAppContext()

  const fetchArchivedRooms = async () => {
    try {
      const { data } = await axios.get('/api/properties/admin', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })

      if (data.success) {
        const archivedRooms = data.properties.filter(room => !room.isAvailable)
        setRooms(archivedRooms) 
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const restoreRoom = async (id) => {
    try {
      setRestoringId(id)
      const { data } = await axios.post('/api/properties/toggle-availability',
        { propertyId: id }, 
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      )
      
      if (data.success) {
        toast.success('Room restored successfully');
        fetchArchivedRooms(); 
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setRestoringId(null)
    }
  }

  const archivedRooms = useMemo(() => rooms || [], [rooms])

  useEffect(() => {
    if (user) {
      fetchArchivedRooms()
    }
  }, [user])

  return (
    <div className='p-4 md:p-8 max-w-7xl mx-auto'>
    <Title align='left' font='outfit' title='Archived Room Properties' />
    
    <h2 className='text-lg font-semibold text-gray-700 mt-6 mb-4'>Archived Rooms</h2>
    
    <div className='w-full shadow-2xl rounded-xl overflow-hidden border border-gray-100'>
        <div className='max-h-[70vh] overflow-y-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-100 sticky top-0 shadow-sm'>
                    <tr>
                        <th className='py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Room Name</th>
                        <th className='py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Room Type</th>
                        <th className='py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider max-md:hidden'>Amenities</th>
                        <th className='py-4 px-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider'>Price / hour</th> 
                        <th className='py-4 px-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider'>Status</th>
                        <th className='py-4 px-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider'>Action</th>
                    </tr>
                </thead>
                
                <tbody className='bg-white divide-y divide-gray-100 text-sm'>
                    {archivedRooms.length > 0 ? (
                        archivedRooms.map((item) => (
                            <tr key={item._id} className='hover:bg-blue-50 transition-colors duration-100'>
                                <td className='py-3 px-4 text-gray-800 font-medium whitespace-nowrap'>
                                    {item.roomType}
                                </td>
                                
                                <td className='py-3 px-4 text-gray-500 max-md:hidden text-ellipsis overflow-hidden max-w-[220px]'>
                                    {item.amenities?.join(', ') || 'N/A'}
                                </td>
                                
                                <td className='py-3 px-4 text-gray-700 font-semibold text-center whitespace-nowrap'>
                                    {currency}{item.pricePerHour} 
                                </td>
                                
                                <td className='py-3 px-4 text-center'>
                                    <span className='rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-600'>
                                        Archived
                                    </span>
                                </td>

                                <td className='py-3 px-4 text-center'>
                                    <button
                                        onClick={() => restoreRoom(item._id)}
                                        disabled={restoringId === item._id}
                                        className='inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-blue-600 hover:border-blue-400 hover:bg-blue-50 disabled:opacity-60'
                                        title='Restore Room'
                                    >
                                        <FaUndo className='h-4 w-4' />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center py-8 text-gray-500 text-base">
                                No archived rooms found.
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

export default Archive