import Room from "../models/Room.js";
import User from "../models/Users.js";

export const registerRoom = async (req, res) => {
    try {
        const {name, address, contact, property} = req.body;
        const admin = req.user._id;

        // Check if user is already resitred
        const room = await Room.findOne({admin})
        if(room){
            return res.json({sucess: false, message: 'Room already registered'})
        }

        await Room.create({name, address, contact, room, admin});

        await User.findByIdAndUpdate(admin, {role: 'admin'});

        res.json({success: true, message: 'Room registered successfully'})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}