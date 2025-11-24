import React, { useState } from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast'


const AddRoom = () => {

  const { axios, getToken } = useAppContext()

  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
  })

  const [inputs, setInputs] = useState({
    name: '',
    roomType: '',
    pricePerHour: 0,
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

  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    //Checks if all inputs are entered
    if (!inputs.name ||!inputs.roomType || !inputs.pricePerHour || !Object.values(images).some(image => image)) {
      toast.error('Please fill in all fields and upload at least one image.')
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData()
      formData.append('name', inputs.name)
      formData.append('roomType', inputs.roomType)
      formData.append('pricePerHour', inputs.pricePerHour)
      // Converts amenities object to array of selected amenities
      const amenities = Object.keys(inputs.amenities).filter(key => inputs.amenities[key])
      formData.append('amenities', JSON.stringify(amenities))
      // Add image to FormDdta
      Object.keys(images).forEach(key => {
        images[key] && formData.append('images', images[key])
      })
      const { data } = await axios.post('/api/properties/', formData, {
        headers:
          { Authorization: `Bearer ${await getToken()}` }
      })

      if (data.success) {
        toast.success('Room added successfully')
        setInputs({
          name: '',
          roomType: '',
          pricePerHour: 0,
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
        setImages({
          1: null,
          2: null,
          3: null,
          4: null,
        })
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmitHandler}>
      <Title align='left' font='outfit' title='Add Room' />
      <p className='text-gray-800 mt-10'>Images</p>
      <div className='grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap'>
        {Object.keys(images).map((key) => (
          <label htmlFor={`roomImage${key}`} key={key} className='cursor-pointer w-32 h-32'>
            <img src={images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea} alt="" />
            <input type="file" accept='image/*' id={`roomImage${key}`} hidden onChange={e => setImages({ ...images, [key]: e.target.files[0] })} />
          </label>
        ))}
      </div>

      <div className='w-full flex max-sm:flex-col sm:gap-4 mt-4'>
        <div className='flex-1 max-2-48'>
           <p className='mt-4 text-gray-800'>
            Room Name
          </p>
          <input type="text" className='border border-gray-300 mt-1 rounded p-2 w-24' value={inputs.name} onChange={e => setInputs({ ...inputs, name: String(e.target.value) })} />
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

      <p className='text-gray-800 mt-4'>Amenities</p>
      <div>
        {Object.keys(inputs.amenities).map((amenity, index) => (
          <div key={index}>
            <input type="checkbox" id={`amenities${index + 1}`} checked={inputs.amenities[amenity]} onChange={() => setInputs({ ...inputs, amenities: { ...inputs.amenities, [amenity]: !inputs.amenities[amenity] } })} />
            <label htmlFor={`amenities${index + 1}`}>{amenity}</label>
          </div>
        ))}
      </div>
      <button className='bg-primary text-white px-8 py-2 rouneded mt-8 cursor-pointerd' disabled={loading}>
        {loading ? 'Adding....' : "Add Room"}
      </button>
    </form>
  )
}

export default AddRoom
