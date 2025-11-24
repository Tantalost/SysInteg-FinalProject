import React, { useState } from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast'
import { FaTimes } from 'react-icons/fa'

const AddRoom = () => {
  const { axios, getToken } = useAppContext()

  const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null })
  const [inputs, setInputs] = useState({
    name: '',
    roomType: '',
    pricePerHour: '',
    amenities: {
      'Free Wifi': false,
      'Air Conditioning': false,
      'Room Service': false,
      'Charging Station (USB-C / Fast Charge)': false,
      'Private Bathroom Access': false,
      'CCTV Security / Smart Lock': false,
      'Mini Bar': false,
      'Customizable Lighting': false,
      '24/7 Support Staff': false,
    }
  })
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (!inputs.roomType || !inputs.pricePerHour || !Object.values(images).some(img => img)) {
      toast.error('Please fill in all fields and upload at least one image.')
      return
    }
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', inputs.name)
      formData.append('roomType', inputs.roomType)
      formData.append('pricePerHour', inputs.pricePerHour)
      const amenities = Object.keys(inputs.amenities).filter(a => inputs.amenities[a])
      formData.append('amenities', JSON.stringify(amenities))
      Object.keys(images).forEach(key => images[key] && formData.append('images', images[key]))

      const { data } = await axios.post('/api/properties/', formData, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })

      if (data.success) {
        toast.success('Room added successfully')
        setInputs({
          name: '',
          roomType: '',
          pricePerHour: '',
          amenities: Object.fromEntries(Object.keys(inputs.amenities).map(a => [a, false]))
        })
        setImages({ 1: null, 2: null, 3: null, 4: null })
      } else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const removeImage = (key) => {
    setImages({ ...images, [key]: null })
  }

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
                  onChange={e => setImages({ ...images, [key]: e.target.files[0] })}
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
        <div className='flex-1 max-2-48'>
          <p className='text-gray-800 mt-4'>Room Type</p>
          <select value={inputs.roomType} onChange={e => setInputs({ ...inputs, roomType: e.target.value })}
            className='border opacity-70 border-gray-300 mt-1 rounded p-2 w-full'>
            <option value="">Select Room Type</option>
            <option value="Gaming Room">Gaming Room</option>
            <option value="KTV Room">KTV Room</option>
            <option value="Movie Room">Movie Room</option>
          </select>
        </div>
        <div>
          <p className='mt-4 text-gray-800'>
            Price <span className='text-xs'>/hour</span>
          </p>
          <input type="number" className='border border-gray-300 mt-1 rounded p-2 w-24' value={inputs.pricePerHour} onChange={e => setInputs({ ...inputs, pricePerHour: Number(e.target.value) })} />
        </div>
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
              onClick={() => setInputs({ ...inputs, amenities: { ...inputs.amenities, [amenity]: !inputs.amenities[amenity] } })}
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
