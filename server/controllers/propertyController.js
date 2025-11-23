import { response } from "express";
import Room from "../models/Room.js";
import { v2 as cloudinary } from "cloudinary";
import Property from "../models/Property.js";

// API to create a new property for a room
export const createProperty = async (req, res) => {
    try {
        const { roomType, pricePerHour, amenities } = req.body;

        // Debug: Check if files arrived
        console.log("Files received:", req.files); 

        if (!req.files || req.files.length === 0) {
            return res.json({ success: false, message: 'No images uploaded' });
        }

        const room = await Room.findOne({ admin: req.auth().userId });
        if (!room) return res.json({ success: false, message: 'Room/Host profile not found' });

        // 2. Upload images to Cloudinary
        const uploadedImages = req.files.map(async (file) => {
            // SAFETY CHECK: Ensure path exists
            if(!file.path) throw new Error("File path is missing. Check uploadMiddleware.");
            
            const response = await cloudinary.uploader.upload(file.path, {
                resource_type: 'image' 
            });
            return response.secure_url;
        })

        const images = await Promise.all(uploadedImages)

        // 3. Create the new Property
        const newProperty = await Property.create({
            room: room._id,     
            roomType,
            pricePerHour: +pricePerHour,
            amenities: JSON.parse(amenities),
            images,
        })

        room.properties = room.properties || []; 
        room.properties.push(newProperty._id);
        await room.save();

        res.json({ success: true, message: 'Property created successfully' })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// API to get all properties (Public Feed)
export const getProperties = async (req, res) => {
    try {
        const properties = await Property.find({ isAvailable: true }).populate({
            path: 'room',
            populate: {
                path: 'admin',
                select: 'image'
            }
        }).sort({ createdAt: -1 })
        res.json({ success: true, properties });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// API to get all properties for a specific room (Admin Dashboard)
export const getAdminProperties = async (req, res) => {
    try {
        const roomData = await Room.findOne({ admin: req.auth.userId })
        if (!roomData) {
            return res.json({ success: true, properties: [] });
        }

        const properties = await Property.find({ room: roomData._id.toString() }).populate("room");
        res.json({ success: true, properties });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// API to toggle property availability
export const togglePropertyAvailability = async (req, res) => {
    try {
        const { propertyId } = req.body;

        const propertyData = await Property.findById(propertyId);

        if (!propertyData) {
            return res.json({ success: false, message: 'Property not found' });
        }

        propertyData.isAvailable = !propertyData.isAvailable;
        await propertyData.save();

        res.json({ success: true, message: 'Property availability updated successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}