import React, { useMemo, useState } from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast'
import { FaTimes } from 'react-icons/fa'

const AMENITY_OPTIONS = [
  'Free Wifi',
  'Air Conditioning',
  'Room Service',
  'Charging Station (USB-C / Fast Charge)',
  'Private Bathroom Access',
  'CCTV Security / Smart Lock',
  'Mini Bar',
  'Customizable Lighting',
  '24/7 Support Staff',
]

const createAmenityState = () =>
  AMENITY_OPTIONS.reduce((acc, amenity) => {
    acc[amenity] = false
    return acc
  }, {})

const createImageState = () => ({ 1: null, 2: null, 3: null, 4: null })

const createInitialInputs = () => ({
  name: '',
  roomType: '',
  pricePerHour: '',
  amenities: createAmenityState(),
})

const AddRoom = () => {
  const { axios, getToken } = useAppContext()

  const [images, setImages] = useState(createImageState)
  const [inputs, setInputs] = useState(createInitialInputs)
  const [loading, setLoading] = useState(false)

  const selectedAmenities = useMemo(
    () => Object.entries(inputs.amenities)
      .filter(([, active]) => active)
      .map(([amenity]) => amenity),
    [inputs.amenities]
  )

  const selectedImages = useMemo(
    () => Object.values(images).filter(Boolean),
    [images]
  )

  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (slot, file) => {
    setImages(prev => ({ ...prev, [slot]: file || null }))
  }

  const toggleAmenity = (amenity) => {
    setInputs(prev => ({
      ...prev,
      amenities: { ...prev.amenities, [amenity]: !prev.amenities[amenity] }
    }))
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (!inputs.name || !inputs.roomType || !inputs.pricePerHour) {
      toast.error('Please fill in all fields.')
      return
    }

    if (!selectedImages.length) {
      toast.error('Upload at least one room image.')
      return
    }

    setLoading(true)
    try {
      const token = await getToken()
      if (!token) {
        toast.error('You must be signed in to add a room.')
        return
      }

      const formData = new FormData()
      formData.append('name', inputs.name.trim())
      formData.append('roomType', inputs.roomType)
      formData.append('pricePerHour', inputs.pricePerHour)
      formData.append('amenities', JSON.stringify(selectedAmenities))
      selectedImages.forEach(file => formData.append('images', file))

      const { data } = await axios.post('/api/properties', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (data.success) {
        toast.success('Room added successfully')
        setInputs(createInitialInputs())
        setImages(createImageState())
      } else {
        toast.error(data.message || 'Failed to add room')
      }
    } catch (error) {
      console.log("AXIOS ERROR:", error);
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  const removeImage = (key) => handleImageChange(key, null)

  return (
    <form
      onSubmit={onSubmitHandler}
      className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-2xl space-y-6"
    >
      <Title align="left" font="outfit" title="Add Room" />

      {/* Images */}
      <div>
        <p className="text-gray-700 font-semibold mb-3">Upload Images</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.keys(images).map((key) => (
            <div key={key} className="relative group h-32 rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition">
              <label htmlFor={`roomImage${key}`} className="cursor-pointer w-full h-full flex items-center justify-center bg-gray-50">
                <img
                  src={images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea}
                  alt={`Room ${key}`}
                  className="object-cover w-full h-full rounded-xl"
                />
                <input
                  type="file"
                  accept="image/*"
                  id={`roomImage${key}`}
                  hidden
                  onChange={e => handleImageChange(key, e.target.files?.[0] || null)}
                />
              </label>
              {images[key] && (
                <button
                  type="button"
                  onClick={() => removeImage(key)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <FaTimes size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className='w-full flex max-sm:flex-col sm:gap-4 mt-4'>
        {/* Room Name and Type Container */}
        <div className='flex-1 flex max-sm:flex-col sm:gap-4'>
          {/* Room Name Input */}
          <div className='flex-1'>
            <p className='text-gray-800 mt-4'>Room Name</p>
            <input
              type="text"
              value={inputs.name}
              onChange={e => handleInputChange('name', e.target.value)}
              className='border opacity-70 border-gray-300 mt-1 rounded p-2 w-full'
              required
            />
          </div>

          {/* Room Type Select */}
          <div className='flex-1'>
            <p className='text-gray-800 mt-4'>Room Type</p>
            <select
              value={inputs.roomType}
              onChange={e => handleInputChange('roomType', e.target.value)}
              className='border opacity-70 border-gray-300 mt-1 rounded p-2 w-full'
              required
            >
              <option value="">Select Room Type</option>
              <option value="Gaming Room">Gaming Room</option>
              <option value="KTV Room">KTV Room</option>
              <option value="Movie Room">Movie Room</option>
            </select>
          </div>
        </div>

        {/* Price Input */}
        <div>
          <p className='mt-4 text-gray-800'>
            Price <span className='text-xs'>/hour</span>
          </p>
          <input
            type="number"
            className='border border-gray-300 mt-1 rounded p-2 w-24'
            value={inputs.pricePerHour}
            onChange={e => handleInputChange('pricePerHour', e.target.value)}
            required
          />
        </div>
      </div>


      {/* Amenities */}
      <div>
        <p className="text-gray-700 font-semibold mb-3">Amenities</p>
        <div className="flex flex-wrap gap-3">
          {Object.keys(inputs.amenities).map((amenity, index) => (
            <button
              type="button"
              key={index}
              onClick={() => toggleAmenity(amenity)}
              className={`px-4 py-2 rounded-full border transition ${
                inputs.amenities[amenity]
                  ? 'bg-primary text-white border-primary'
                  : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-primary hover:text-white'
              }`}
            >
              {amenity}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto bg-primary text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add Room'}
      </button>
    </form>
  )
}

export default AddRoom
