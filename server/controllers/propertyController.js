import { response } from "express";
import Room from "../models/Room.js";
import { v2 as cloudinary } from "cloudinary";
import Property from "../models/Property.js";

// API to create a new property for a room
export const createProperty = async (req, res) => {
    try {
        const { name, roomType, pricePerHour, amenities } = req.body;

        console.log("Files received:", req.files); 

        if (!req.files || req.files.length === 0) {
            return res.json({ success: false, message: 'No images uploaded' });
        }

        let room = await Room.findOne({ admin: req.auth().userId });
        if (!room) {
            const fallbackName = `${req.user?.username || 'Host'}'s Room`;
            room = await Room.create({
                name: fallbackName,
                address: 'To be updated',
                admin: req.auth().userId,
                properties: []
            });
        }

        const uploadedImages = req.files.map(async (file) => {
            if(!file.path) throw new Error("File path is missing. Check uploadMiddleware.");
            
            const response = await cloudinary.uploader.upload(file.path, {
                resource_type: 'image' 
            });
            return response.secure_url;
        })

        const images = await Promise.all(uploadedImages)

        const newProperty = await Property.create({
            name: name || roomType, // Use roomType as default name if not provided
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
        const roomData = await Room.findOne({ admin: req.auth().userId })
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

export const updateProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const { roomType, pricePerHour, amenities } = req.body;

        const roomData = await Room.findOne({ admin: req.auth().userId });
        if (!roomData) {
            return res.json({ success: false, message: 'Admin room not found' });
        }

        const propertyData = await Property.findOne({ _id: id, room: roomData._id.toString() });
        if (!propertyData) {
            return res.json({ success: false, message: 'Property not found' });
        }

        if (roomType) {
            propertyData.roomType = roomType;
        }

        if (pricePerHour !== undefined) {
            propertyData.pricePerHour = Number(pricePerHour);
        }

        if (amenities !== undefined) {
            let nextAmenities = amenities;
            if (typeof amenities === 'string') {
                nextAmenities = JSON.parse(amenities || '[]');
            }

            if (Array.isArray(nextAmenities)) {
                propertyData.amenities = nextAmenities;
            }
        }

        await propertyData.save();

        res.json({ success: true, message: 'Property updated successfully', property: propertyData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const roomData = await Room.findOne({ admin: req.auth().userId });

        if (!roomData) {
            return res.json({ success: false, message: 'Admin room not found' });
        }

        const propertyData = await Property.findOne({ _id: id, room: roomData._id.toString() });

        if (!propertyData) {
            return res.json({ success: false, message: 'Property not found' });
        }

        await Property.findByIdAndDelete(id);
        roomData.properties = roomData.properties.filter(
            (propertyId) => propertyId.toString() !== id
        );
        await roomData.save();

        res.json({ success: true, message: 'Property deleted successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}