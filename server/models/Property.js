import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    roomType: {type: String, required: true},
    pricePerHour: {type: Number, required: true},
    amenities: {type: Array, required: true},
    images: [{type: String}],
    isAvailable: {type: Boolean, default: true},
    room: {type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true},

},{timestamps: true});

const Property = mongoose.model('Property', propertySchema);

export default Property;