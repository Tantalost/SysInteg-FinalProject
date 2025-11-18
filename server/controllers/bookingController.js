import { dashboardDummyData } from "../../src/assets/assets";
import Booking from "../models/Booking.js";
import Property from "../models/Property.js";
import Room from "../models/Room.js";

// Function to check Room Availability
const checkAvailability = async ({ checkInDate, checkOutDate, property }) => {
    try {
        const bookings = await Booking.find({
            property,
            checkInDate: { $lte: checkOutDate },
            checkOutDate: { $gte: checkInDate },
        });
        const isAvailable = bookings.length === 0;
        return isAvailable;
    } catch (error) {
        console.error(error.message);
    }
}

// API to check room availability (POST /api/bookings/check-availability)
export const checkAvailabilityAPI = async (req, res) => {
    try {
        const { property, checkInDate, checkOutDate } = req.body;
        const isAvailable = await checkAvailability({ property, checkInDate, checkOutDate });
        res.json({ success: true, isAvailable });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// API to create a new booking (POST /api/bookings/book)
export const createBooking = async (req, res) => {
    try {
        const { property, checkInDate, checkOutDate, guests } = req.body;
        const user = req.user._id;
        //before booking check availability
        const isAvailable = await checkAvailability({
            property,
            checkInDate,
            checkOutDate
        });
        if (!isAvailable) {
            return res.json({ success: false, message: 'Property is not available for the selected dates' });
        }

        //calculate total price
        const propertyData = await Property.findById(property).populate("room");
        let totalPrice = propertyData.pricePerHour;
        //calculate based on hours
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const hours = Math.ceil(timeDiff / (1000 * 3600 * 24));
        totalPrice *= hours;

        const booking = await Booking.create({
            user,
            property,
            room: propertyData.room._id,
            guest: +guests,
            checkInDate,
            checkOutDate,
            totalPrice,
        });
        res.json({ success: true, message: 'Booking created successfully' })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Failed to create booking" });
    }
};

// API to get user bookings (GET /api/bookings/user)
export const getUserBookings = async (req, res) => {
    try {
        const user = req.user._id;
        const bookings = await Booking.find({ user }).populate('property room').sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        res.json({ success: false, message: "Failed to fetch bookings" });
    }
}

export const getRoomBookings = async (req, res) => {
    try {
        const room = await Room.findOne({ admin: req.auth.userId });
        if (!room) {
            return res.json({ success: false, message: 'Room not found' });
        }
        const bookings = await Booking.find({ room: room._id }).populate('property room user').sort({ createdAt: -1 });
        //Total bookings
        const totalBookings = bookings.length;
        // Total revenue
        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);
        res.json({ success: true, dashboardData: { totalBookings, totalRevenue, bookings } })
    } catch (error) {
        res.json({ success: false, message: "Failed to fetch bookings" });
    }
}
