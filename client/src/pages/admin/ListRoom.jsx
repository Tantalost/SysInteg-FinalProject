import React, { useEffect, useMemo, useState } from 'react'
import Title from '../../components/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { FaArchive, FaEdit, FaTrash, FaTimes } from 'react-icons/fa'

const AMENITY_OPTIONS = [
  'Free Wifi',
  'Air Conditioning',
  'Room Service',
  'Charging Station (USB-C / Fast Charge)',
  'Private Bathroom Access',
  'CCTV Security / Smart Lock',
  'Mini Bar',
  'Customizable Lighting',
  '24/7 Support Staff'
]

const ListRoom = () => {

  const [rooms, setRooms] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editPayload, setEditPayload] = useState({ roomType: '', pricePerHour: '', amenities: [] })
  const [isUpdatingRoom, setIsUpdatingRoom] = useState(false)
  const [pendingAction, setPendingAction] = useState({ type: null, id: null })
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

  const archiveRoom = async (id) => {
    try {
      const room = rooms.find(r => r._id === id);
      if (!room) {
        toast.error('Room not found');
        return;
      }

      if (!room.isAvailable) {
        toast.error('Room is already archived');
        return;
      }

      setPendingAction({ type: 'archive', id });
      const { data } = await axios.post('/api/properties/toggle-availability',
        { propertyId: id }, 
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      )
      
      if (data.success) {
        toast.success('Room archived successfully');
        fetchRooms(); 
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setPendingAction({ type: null, id: null });
    }
  }

  const deleteRoom = async (id) => {
    const shouldDelete = window.confirm('Delete this room permanently?')
    if (!shouldDelete) return

    try {
      setPendingAction({ type: 'delete', id })
      const { data } = await axios.delete(`/api/properties/${id}`, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })

      if (data.success) {
        toast.success('Room deleted successfully')
        fetchRooms()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setPendingAction({ type: null, id: null })
    }
  }

  const openEditModal = (room) => {
    setSelectedRoom(room)
    setEditPayload({
      roomType: room.roomType || '',
      pricePerHour: room.pricePerHour || '',
      amenities: room.amenities || []
    })
    setEditModalOpen(true)
  }

  const closeEditModal = () => {
    setEditModalOpen(false)
    setSelectedRoom(null)
    setEditPayload({ roomType: '', pricePerHour: '', amenities: [] })
  }

  const toggleAmenity = (amenity) => {
    setEditPayload((prev) => {
      const exists = prev.amenities.includes(amenity)
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter(item => item !== amenity)
          : [...prev.amenities, amenity]
      }
    })
  }

  const submitRoomUpdate = async (event) => {
    event.preventDefault()
    if (!selectedRoom?._id) return

    try {
      setIsUpdatingRoom(true)
      const { data } = await axios.put(`/api/properties/${selectedRoom._id}`,
        { 
          roomType: editPayload.roomType,
          pricePerHour: Number(editPayload.pricePerHour),
          amenities: editPayload.amenities
        },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      )

      if (data.success) {
        toast.success('Room updated successfully')
        closeEditModal()
        fetchRooms()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsUpdatingRoom(false)
    }
  }

  const actionDisabled = (type, id) => pendingAction.type === type && pendingAction.id === id

  const formattedRooms = useMemo(() => rooms || [], [rooms])

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
                        <th className='py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Room Name</th>
                        <th className='py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Room Type</th>
                        {/* Renamed Facility to Amenities for clarity, hidden on small screens */}
                        <th className='py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider max-md:hidden'>Amenities</th>
                        {/* Changed Price/night to Price/hour for consistency */}
                        <th className='py-4 px-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider'>Price / hour</th> 
                        <th className='py-4 px-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider'>Availability</th>
                        <th className='py-4 px-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider'>Action</th>
                    </tr>
                </thead>
                
                {/* Table Body: Cleaner Separators and Hover Effect */}
                <tbody className='bg-white divide-y divide-gray-100 text-sm'>
                    {formattedRooms.length > 0 ? (
                        formattedRooms.map((item) => (
                            <tr key={item._id} className='hover:bg-blue-50 transition-colors duration-100'>
                                {/* Room Type */}
                                <td className='py-3 px-4 text-gray-800 font-medium whitespace-nowrap'>
                                    {item.roomType}
                                </td>
                                
                                {/* Amenities (Hidden on small screens) */}
                                <td className='py-3 px-4 text-gray-500 max-md:hidden text-ellipsis overflow-hidden max-w-[220px]'>
                                    {item.amenities?.join(', ') || 'N/A'}
                                </td>
                                
                                {/* Price */}
                                <td className='py-3 px-4 text-gray-700 font-semibold text-center whitespace-nowrap'>
                                    {currency}{item.pricePerHour} 
                                </td>
                                
                                {/* Actions / Availability Toggle */}
                                <td className='py-3 px-4 text-center'>
                                    <label className='relative inline-flex items-center cursor-pointer select-none'>
                                        <input 
                                            onChange={() => toggleAvailability(item._id)} 
                                            type="checkbox" 
                                            className='sr-only peer' 
                                            checked={item.isAvailable} 
                                        />
                                        <div className='w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600 transition-colors duration-200'></div>
                                        <span className={`ms-3 text-sm font-medium ${item.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                                            {item.isAvailable ? 'Active' : 'Hidden'}
                                        </span>
                                    </label>
                                </td>

                                {/* Action Column - Icon Buttons */}
                                <td className='py-3 px-4'>
                                    <div className='flex flex-col items-center gap-2 sm:flex-row sm:justify-center'>
                                        <button
                                            onClick={() => openEditModal(item)}
                                            className='inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-blue-600 hover:border-blue-400 hover:bg-blue-50'
                                            title='Edit Room'
                                        >
                                            <FaEdit className='h-4 w-4' />
                                        </button>
                                        <button
                                            onClick={() => deleteRoom(item._id)}
                                            disabled={actionDisabled('delete', item._id)}
                                            className='inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-red-600 hover:border-red-400 hover:bg-red-50 disabled:opacity-60'
                                            title='Delete Room'
                                        >
                                            <FaTrash className='h-4 w-4' />
                                        </button>
                                        <button
                                            onClick={() => archiveRoom(item._id)}
                                            disabled={!item.isAvailable || actionDisabled('archive', item._id)}
                                            className='inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-amber-600 hover:border-amber-400 hover:bg-amber-50 disabled:opacity-60'
                                            title='Archive Room'
                                        >
                                            <FaArchive className='h-4 w-4' />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center py-8 text-gray-500 text-base">
                                No rooms found. Please add a new room.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>

    {/* Edit Modal */}
    {editModalOpen && (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4'>
        <div className='w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl'>
          <div className='flex items-center justify-between border-b pb-3'>
            <div>
              <p className='text-xs uppercase tracking-wide text-gray-400'>Update Room</p>
              <h3 className='text-xl font-semibold text-gray-800'>{selectedRoom?.roomType}</h3>
            </div>
            <button
              onClick={closeEditModal}
              className='text-gray-500 transition hover:text-gray-800'
              aria-label='Close edit modal'
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={submitRoomUpdate} className='mt-6 space-y-5'>
            <div>
              <label className='text-sm font-medium text-gray-700'>Room Type</label>
              <select
                value={editPayload.roomType}
                onChange={(e) => setEditPayload(prev => ({ ...prev, roomType: e.target.value }))}
                className='mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none'
                required
              >
                <option value="">Select Room Type</option>
                <option value="Gaming Room">Gaming Room</option>
                <option value="KTV Room">KTV Room</option>
                <option value="Movie Room">Movie Room</option>
              </select>
            </div>

            <div>
              <label className='text-sm font-medium text-gray-700'>Price / hour</label>
              <input
                type='number'
                min='0'
                value={editPayload.pricePerHour}
                onChange={(e) => setEditPayload(prev => ({ ...prev, pricePerHour: e.target.value }))}
                className='mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none'
                required
              />
            </div>

            <div>
              <p className='text-sm font-medium text-gray-700 mb-2'>Amenities</p>
              <div className='flex flex-wrap gap-2'>
                {AMENITY_OPTIONS.map((amenity) => {
                  const active = editPayload.amenities.includes(amenity)
                  return (
                    <button
                      type='button'
                      key={amenity}
                      onClick={() => toggleAmenity(amenity)}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        active
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-gray-200 bg-gray-100 text-gray-700 hover:border-blue-200 hover:text-blue-600'
                      }`}
                    >
                      {amenity}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className='flex items-center justify-end gap-3 pt-2'>
              <button
                type='button'
                onClick={closeEditModal}
                className='rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={isUpdatingRoom}
                className='rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60'
              >
                {isUpdatingRoom ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
</div>
  )
}

export default ListRoom