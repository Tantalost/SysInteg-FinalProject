import React, { useEffect, useMemo, useState } from 'react'
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

const currency = "₱";

const MAX_IMAGES = 4

const createAmenityState = () =>
  AMENITY_OPTIONS.reduce((acc, amenity) => {
    acc[amenity] = false
    return acc
  }, {})

const createImageSlots = () => Array.from({ length: MAX_IMAGES }, () => null)

const initialFormState = {
  roomType: '',
  pricePerHour: '',
  discountPercent: '',
  discountStartDate: '',
  discountEndDate: '',
}

const AddRoom = () => {
  const { axios, getToken } = useAppContext()

  const [formValues, setFormValues] = useState(initialFormState)
  const [amenities, setAmenities] = useState(createAmenityState)
  const [imageSlots, setImageSlots] = useState(createImageSlots)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedAmenities = useMemo(
    () =>
      Object.entries(amenities)
        .filter(([, active]) => active)
        .map(([amenity]) => amenity),
    [amenities]
  )

  const selectedFiles = useMemo(
    () => imageSlots.filter(Boolean).map(slot => slot.file),
    [imageSlots]
  )

  useEffect(() => {
    return () => {
      imageSlots.forEach(slot => slot?.preview && URL.revokeObjectURL(slot.preview))
    }
  }, [imageSlots])

  const handleFieldChange = (field, value) => {
    setFormValues(prev => ({ ...prev, [field]: value }))
  }

  const toggleAmenity = (amenity) => {
    setAmenities(prev => ({ ...prev, [amenity]: !prev[amenity] }))
  }

  const updateImageSlot = (index, file) => {
    setImageSlots(prev => {
      const next = [...prev]
      if (prev[index]?.preview) {
        URL.revokeObjectURL(prev[index].preview)
      }

      next[index] = file ? { file, preview: URL.createObjectURL(file) } : null
      return next
    })
  }

  const resetImages = () => {
    setImageSlots(prev => {
      prev.forEach(slot => slot?.preview && URL.revokeObjectURL(slot.preview))
      return createImageSlots()
    })
  }

  const resetForm = () => {
    setFormValues(initialFormState)
    setAmenities(createAmenityState())
    resetImages()
  }

  const validateForm = () => {
    if (!formValues.roomType) return 'Select a room type.'

    const price = Number(formValues.pricePerHour)
    if (!price || price <= 0) return 'Enter a valid price per hour.'

    if (!selectedFiles.length) return 'Upload at least one room image.'
    return null
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    const validationError = validateForm()

    if (validationError) {
      toast.error(validationError)
      return
    }

    setIsSubmitting(true)
    try {
      const token = await getToken()
      if (!token) {
        toast.error('You must be signed in to add a room.')
        return
      }

      const formData = new FormData()
      formData.append('roomType', formValues.roomType)
      formData.append('pricePerHour', Number(formValues.pricePerHour))
      formData.append('amenities', JSON.stringify(selectedAmenities))
      if (formValues.discountPercent) {
        formData.append('discountPercent', Number(formValues.discountPercent))
        formData.append('discountStartDate', formValues.discountStartDate)
        formData.append('discountEndDate', formValues.discountEndDate)
      }
      selectedFiles.forEach(file => formData.append('images', file))

      const { data } = await axios.post('/api/properties', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      })

      if (data.success) {
        toast.success('Room added successfully')
        resetForm()
      } else {
        toast.error(data.message || 'Failed to add room')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
  <form
    onSubmit={onSubmitHandler}
    className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-2xl space-y-8 border border-gray-100"
  >
    <Title align="left" font="outfit" title="Add Room" />

    {/* Image Uploader */}
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-800 font-semibold">Room Images</p>
        <p className="text-xs text-gray-500">{selectedFiles.length}/{MAX_IMAGES} uploaded</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {imageSlots.map((slot, index) => (
          <div
            key={index}
            className="relative group h-32 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 hover:border-primary transition"
          >
            <label
              htmlFor={`roomImage${index}`}
              className="cursor-pointer w-full h-full flex items-center justify-center"
            >
              <img
                src={slot ? slot.preview : assets.uploadArea}
                alt={`Room slot ${index + 1}`}
                className="object-cover w-full h-full"
              />
              <input
                type="file"
                accept="image/*"
                id={`roomImage${index}`}
                hidden
                onChange={(e) => updateImageSlot(index, e.target.files?.[0] || null)}
              />
            </label>
            {slot && (
              <button
                type="button"
                onClick={() => updateImageSlot(index, null)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                <FaTimes size={12} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>

    {/* Room Type + Price */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <label className="text-gray-800 font-medium">Room Type</label>
        <select
          value={formValues.roomType}
          onChange={(e) => handleFieldChange("roomType", e.target.value)}
          className="border border-gray-300 mt-2 rounded-lg p-3 w-full text-sm focus:ring-2 focus:ring-primary/60 focus:border-primary transition"
          required
        >
          <option value="">Select Room Type</option>
          <option value="Gaming Room">Gaming Room</option>
          <option value="KTV Room">KTV Room</option>
          <option value="Movie Room">Movie Room</option>
        </select>
      </div>

      <div>
        <label className="text-gray-800 font-medium">
          Price <span className="text-xs">/ hour</span>
        </label>
        <input
          type="number"
          min="1"
          className="border border-gray-300 mt-2 rounded-lg p-3 w-full text-sm focus:ring-2 focus:ring-primary/60 focus:border-primary transition"
          value={formValues.pricePerHour}
          onChange={(e) => handleFieldChange("pricePerHour", e.target.value)}
          required
        />
      </div>
    </div>

    {/* Amenities */}
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-gray-800 font-semibold">Amenities</p>
        <p className="text-xs text-gray-500">{selectedAmenities.length} selected</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {Object.keys(amenities).map((amenity) => {
          const active = amenities[amenity]
          return (
            <button
              type="button"
              key={amenity}
              onClick={() => toggleAmenity(amenity)}
              className={`px-4 py-2 rounded-full border text-sm transition-all ${
                active
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-primary hover:text-white"
              }`}
            >
              {amenity}
            </button>
          )
        })}
      </div>
    </div>

    {/* Discount Section */}
    <div className="border-t border-gray-200 pt-6">
      <p className="text-gray-800 font-semibold mb-3">Add Discount (Optional)</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-gray-700 text-sm">Discount Percent</label>
          <input
            type="number"
            min="0"
            max="100"
            value={formValues.discountPercent}
            onChange={(e) => handleFieldChange("discountPercent", e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full mt-1 text-sm focus:ring-2 focus:ring-primary/60 focus:border-primary"
            placeholder="e.g., 10"
          />
        </div>

        <div>
          <label className="text-gray-700 text-sm">Start Date</label>
          <input
            type="date"
            value={formValues.discountStartDate}
            onChange={(e) => handleFieldChange("discountStartDate", e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full mt-1 text-sm focus:ring-2 focus:ring-primary/60 focus:border-primary"
          />
        </div>

        <div>
          <label className="text-gray-700 text-sm">End Date</label>
          <input
            type="date"
            value={formValues.discountEndDate}
            onChange={(e) => handleFieldChange("discountEndDate", e.target.value)}
            min={formValues.discountStartDate}
            className="border border-gray-300 rounded-lg p-3 w-full mt-1 text-sm focus:ring-2 focus:ring-primary/60 focus:border-primary"
          />
        </div>
      </div>

      {formValues.discountPercent && (
        <p className="text-xs text-gray-500 mt-2">
          Discount: {formValues.discountPercent}% — Original: {currency}{formValues.pricePerHour}/hr → Now:{" "}
          {currency}
          {(
            Number(formValues.pricePerHour) *
            (1 - Number(formValues.discountPercent) / 100)
          ).toFixed(2)}
          /hr
        </p>
      )}
    </div>

    {/* Buttons */}
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto bg-primary text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50"
      >
        {isSubmitting ? "Uploading..." : "Add Room"}
      </button>

      <button
        type="button"
        onClick={resetForm}
        disabled={isSubmitting}
        className="w-full sm:w-auto border border-gray-300 text-gray-700 px-6 py-3 rounded-xl text-lg font-medium hover:bg-gray-50 transition disabled:opacity-50"
      >
        Reset Form
      </button>
    </div>
  </form>
)
}

export default AddRoom
