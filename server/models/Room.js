import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    name: {type: String, required: true},
    address: {type: String, required: true},
    contact: {type: String, required: true},
    admin: {type: String, required: true, ref: 'User'},
    property: {type: String, required: true},
},{timestamps: true});

const Room = mongoose.model('Room', roomSchema);
export default Room;