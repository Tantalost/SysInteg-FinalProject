import transporter from "../configs/nodemailer.js";
import Booking from "../models/Booking.js";
import Property from "../models/Property.js";
import Room from "../models/Room.js";

// Function to check Room Availability
const checkAvailability = async ({ room, checkInDate, checkOutDate }) => {
    try {
        return await Booking.findOne({
            room,
            checkInDate: { $lt: checkOutDate },
            checkOutDate: { $gt: checkInDate }
        }) === null;
    } catch (error) {
        console.error("checkAvailability error:", error);
        return false;
    }
};

const generateReferenceId = (length = 6) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

// API to check room availability (POST /api/bookings/check-availability)
export const checkAvailabilityAPI = async (req, res) => {
    try {
        const { room, date, startTime, duration } = req.body;

        if (!room || !date || !startTime || !duration) {
            return res.json({ success: false, message: "Missing required fields" });
        }

        const checkIn = new Date(`${date}T${startTime}:00`);
        const checkOut = new Date(checkIn.getTime() + duration * 60 * 60 * 1000);

        const conflict = await Booking.findOne({
            room,
            checkInDate: { $lt: checkOut },
            checkOutDate: { $gt: checkIn }
        });

        const isAvailable = !conflict;

        return res.json({ success: true, isAvailable });

    } catch (error) {
        console.error("Check availability error:", error);
        res.json({ success: false, message: error.message });
    }
};

// API to create a new booking (POST /api/bookings/book)
export const createBooking = async (req, res) => {
    try {
        const { property, room, date, startTime, duration, guests } = req.body;
        
        // 1. Check if user exists (Security Check)
        if (!req.user || !req.user._id) {
            return res.json({ success: false, message: "User authentication failed" });
        }
        const user = req.user._id;

        const checkIn = new Date(`${date}T${startTime}:00`);
        const checkOut = new Date(checkIn.getTime() + duration * 60 * 60 * 1000);

        const isAvailable = await checkAvailability({
            room,
            checkInDate: checkIn,
            checkOutDate: checkOut
        });

        if (!isAvailable) {
            return res.json({ success: false, message: 'This timeslot is already booked' });
        }

        const roomData = await Property.findById(property);
        if (!roomData) {
            return res.json({ success: false, message: 'Property not found' });
        }

        const totalPrice = roomData.pricePerHour * duration;

        let referenceId;
        let isUnique = false;
        while (!isUnique) {
            referenceId = generateReferenceId(6);
            const existingBooking = await Booking.findOne({ referenceId });
            if (!existingBooking) {
                isUnique = true;
            }
        }

        // ======================================================
        // FIX IS HERE: Added 'const booking ='
        // ======================================================
        const booking = await Booking.create({
            user,
            property,
            room,
            guests,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            totalPrice,
            referenceId,
        });

        // OPTIONAL FIX: Use local variables (date, startTime) for the email
        // because the 'booking' object usually stores full Date objects, not strings.
        const mailOptions = {
            from: process.env.SENDER_EMAIL, 
            to: req.user.email,
            subject: 'Room Booking Details',
            html: `
                <h2>Your Booking Details</h2>
                <p>Dear ${req.user.username || 'Guest'},</p>
                <p>Thank you for your booking! Here are your details:</p>
                <ul>
                    <li><strong>Booking ID:</strong> ${booking._id}</li>
                    <li><strong>Room Reference:</strong> ${booking.referenceId}</li>
                    <li><strong>Date:</strong> ${date}</li> 
                    <li><strong>Start Time:</strong> ${startTime}</li>
                    <li><strong>Duration:</strong> ${duration} hours</li>
                    <li><strong>Booking Amount:</strong> ${process.env.CURRENCY || 'P'} ${totalPrice}</li>
                </ul>
                <p>We look forward to seeing you!</p>
            `
        }

        // Wrap email in try/catch so it doesn't crash the response if email fails
        try {
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error("Email sending failed:", emailError);
            // We still return success because the booking WAS created in DB
        }

        res.json({ success: true, message: 'Booking created successfully' });

    } catch (error) {
        console.error("Create booking error:", error);
        res.json({ success: false, message: "Failed to create booking" });
    }
};

// API to get user bookings (GET /api/bookings/user)
export const getUserBookings = async (req, res) => {
    try {
        console.log("=== getUserBookings START ===");
        console.log("req.user:", req.user);
        console.log("req.user._id:", req.user?._id);

        // Check if user is authenticated
        if (!req.user || !req.user._id) {
            console.log("❌ No user authentication data");
            return res.json({ 
                success: false, 
                message: "User authentication required" 
            });
        }

        const userId = req.user._id;
        console.log("✅ User ID:", userId);

        // First, check if any bookings exist for this user
        const count = await Booking.countDocuments({ user: userId });
        console.log(`📊 Total bookings in DB for user: ${count}`);

        // Fetch bookings WITHOUT population first to check if basic query works
        const basicBookings = await Booking.find({ user: userId })
            .sort({ createdAt: -1 })
            .lean();

        console.log(`📦 Basic bookings found: ${basicBookings.length}`);
        if (basicBookings.length > 0) {
            console.log("First booking sample:", JSON.stringify(basicBookings[0], null, 2));
        }

        // Now try with population
        let bookings = [];
        try {
            bookings = await Booking.find({ user: userId })
                .populate("property", "name address pricePerHour images")
                .populate("room", "name roomNumber capacity")
                .sort({ createdAt: -1 })
                .lean();
            
            console.log(`✅ Populated bookings: ${bookings.length}`);
        } catch (populateError) {
            console.error("❌ Population error:", populateError);
            // If population fails, return basic bookings
            bookings = basicBookings;
            console.log("⚠️ Returning unpopulated bookings due to population error");
        }

        console.log("=== getUserBookings END ===");

        return res.json({ 
            success: true, 
            bookings,
            count: bookings.length 
        });

    } catch (error) {
        console.error("❌ FATAL ERROR in getUserBookings:", error);
        console.error("Error stack:", error.stack);
        
        return res.json({ 
            success: false, 
            message: "Failed to fetch bookings",
            error: error.message 
        });
    }
};

// API to get room bookings for admin/owner (GET /api/bookings/room)
export const getRoomBookings = async (req, res) => {
    try {
        console.log("=== getRoomBookings (GLOBAL VIEW) START ===");
        
        // 1. REMOVED: The logic that filters rooms by owner/userId. 
        // We want to see ALL bookings regardless of who owns the room.

        // 2. Fetch ALL bookings directly
        let bookings = [];
        try {
            // Changed query to find({}) to get EVERYTHING
            bookings = await Booking.find({}) 
                .populate("property", "name address")
                .populate("room", "name roomNumber")
                .populate("user", "name email phone") // <--- Crucial: This gets the "User Name" for the table
                .sort({ createdAt: -1 }) // Newest bookings first
                .lean();
            
            console.log(`✅ Fetched Total Global Bookings: ${bookings.length}`);
        } catch (populateError) {
            console.error("❌ Database error:", populateError);
            bookings = [];
        }

        // 3. Calculate stats based on all bookings
        const totalBookings = bookings.length;
        const totalRevenue = bookings.reduce((acc, booking) => 
            acc + (booking.totalPrice || 0), 0
        );

        console.log(`Stats - Bookings: ${totalBookings}, Revenue: ${totalRevenue}`);
        console.log("=== getRoomBookings END ===");

        return res.json({ 
            success: true, 
            dashboardData: { 
                totalBookings, 
                totalRevenue, 
                bookings 
            }
        });

    } catch (error) {
        console.error("❌ FATAL ERROR in getRoomBookings:", error);
        return res.json({ 
            success: false, 
            message: "Failed to fetch bookings",
            error: error.message 
        });
    }
};

// Optional: Get all bookings for a specific room (GET /api/bookings/room/:roomId)
export const getBookingsByRoom = async (req, res) => {
    try {
        const { roomId } = req.params;

        if (!roomId) {
            return res.json({ 
                success: false, 
                message: "Room ID is required" 
            });
        }

        const bookings = await Booking.find({ room: roomId })
            .populate("user", "name email")
            .sort({ checkInDate: 1 })
            .lean();

        res.json({ 
            success: true, 
            bookings,
            count: bookings.length 
        });

    } catch (error) {
        console.error("Error fetching bookings by room:", error);
        res.json({ 
            success: false, 
            message: "Failed to fetch bookings",
            error: error.message 
        });
    }
};