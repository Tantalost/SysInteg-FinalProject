import { response } from "express";
import Room from "../models/Room";
import { v2 as cloudinary } from "cloudinary";

// API to create a new property for a room
export const createProperty = async (req, res) => {
    try {
        const { roomType, pricePerNight, amenities} = req.body;
        const room = await Room.findOne({admin: req.auth.userId});

        if(!room) return res.json({success: false, message: 'Room not found'});

        //upload images to cloudinary
        const uploadedImages = req.files.map(async (file)=> {
            const responce = await cloudinary.uploader.upload(file.path);
            return response.secure_url;
        })

    } catch (error) {
        
    }
}

// API to get all properties
export const getProperties = async (req, res) => {

}

// API to get all properties for a specific room
export const getAdminProperties = async (req, res) => {

}

// API to toggle property availability
export const togglePropertyAvailability = async (req, res) => {

}