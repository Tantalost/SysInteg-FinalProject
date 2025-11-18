import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
    property: {type: String, required: true},
    roomType: {type: String, required: true},
    pricePerNight: {type: Number, required: true},
    amenities: {type: Array, required: true},
    images: [{type: String}],
    isAvailable: {type: Boolean, default: true},

},{timestamps: true});

const Property = mongoose.model('Property', propertySchema);

export default Property;