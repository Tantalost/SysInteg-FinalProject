import { response } from "express";
import Room from "../models/Room";
import { v2 as cloudinary } from "cloudinary";
import Property from "../models/Property.js";

// API to create a new property for a room
export const createProperty = async (req, res) => {
    try {
        const { roomType, pricePerHour, amenities} = req.body;
        const room = await Room.findOne({admin: req.auth.userId});

        if(!room) return res.json({success: false, message: 'Room not found'});

        //upload images to cloudinary
        const uploadedImages = req.files.map(async (file)=> {
            const response = await cloudinary.uploader.upload(file.path);
            return response.secure_url;
        })
        // Waits for all uploads to complete
        const images = await Promise.all(uploadedImages)
        await Property.create({
            room: room._id,
            roomType,
            pricePerHour: +pricePerHour,
            amenities: JSON.parse(amenities),
            images,
        })
        res.json({success: true, message: 'Property created successfully'})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

// API to get all properties
export const getProperties = async (req, res) => {
    try {
        const properties = await Property.find({isAvailable: true}).populate({
            path: 'room',
            populate: {
                path: 'admin',
                select: 'image'
            }
        }).sort({createdAt: -1})
        res.json({success: true, properties});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

// API to get all properties for a specific room
export const getAdminProperties = async (req, res) => {
    try {
        const roomData = await Room({admin: req.auth.userId})
        const properties = await Property.find({room: roomData._id.toString()}).populate(("room"));
        res.json({success: true, properties});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

// API to toggle property availability
export const togglePropertyAvailability = async (req, res) => {
    try {
        const {propertyId} = req.body;
        const roomData = await Room.findById(roomId)
        roomData.isAvailable = !roomData.isAvailable;
        await roomData.save();
        res.json({success: true, message: 'Property availability updated successfully'});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}