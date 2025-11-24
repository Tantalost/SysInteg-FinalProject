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

        await Booking.create({
            user,
            property,
            room,
            guests,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            totalPrice,
        });

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
        console.log("=== getRoomBookings START ===");
        console.log("req.user:", req.user);
        console.log("req.auth:", req.auth);
        
        // Try multiple ways to get userId
        let userId = null;
        
        if (req.user && req.user._id) {
            userId = req.user._id;
            console.log("✅ Got userId from req.user._id:", userId);
        } else if (req.user && req.user.id) {
            userId = req.user.id;
            console.log("✅ Got userId from req.user.id:", userId);
        } else if (req.userId) {
            userId = req.userId;
            console.log("✅ Got userId from req.userId:", userId);
        } else if (typeof req.auth === 'function') {
            const authData = req.auth();
            userId = authData.userId || authData.user_id;
            console.log("✅ Got userId from req.auth():", userId);
        }
        
        if (!userId) {
            console.log("❌ No userId found");
            return res.json({ 
                success: false, 
                message: 'Authentication required' 
            });
        }

        console.log("Searching for rooms with owner:", userId);

        // Try finding rooms with different field names
        let rooms = await Room.find({ owner: userId }).select('_id');
        console.log(`Found ${rooms.length} rooms with 'owner' field`);
        
        if (rooms.length === 0) {
            // Try 'admin' field
            rooms = await Room.find({ admin: userId }).select('_id');
            console.log(`Found ${rooms.length} rooms with 'admin' field`);
        }
        
        if (rooms.length === 0) {
            // Try 'user' field
            rooms = await Room.find({ user: userId }).select('_id');
            console.log(`Found ${rooms.length} rooms with 'user' field`);
        }

        if (rooms.length === 0) {
            console.log("⚠️ No rooms found for this user");
            return res.json({ 
                success: true, 
                dashboardData: { 
                    totalBookings: 0, 
                    totalRevenue: 0, 
                    bookings: [] 
                }
            });
        }

        const roomIds = rooms.map(r => r._id);
        console.log("Room IDs:", roomIds);

        // Check bookings count first
        const bookingCount = await Booking.countDocuments({ room: { $in: roomIds } });
        console.log(`📊 Total bookings for these rooms: ${bookingCount}`);

        // Fetch basic bookings first
        const basicBookings = await Booking.find({ room: { $in: roomIds } })
            .sort({ createdAt: -1 })
            .lean();

        console.log(`📦 Basic bookings fetched: ${basicBookings.length}`);

        // Try with population
        let bookings = [];
        try {
            bookings = await Booking.find({ room: { $in: roomIds } })
                .populate("property", "name address")
                .populate("room", "name roomNumber")
                .populate("user", "name email phone")
                .sort({ createdAt: -1 })
                .lean();
            
            console.log(`✅ Populated bookings: ${bookings.length}`);
        } catch (populateError) {
            console.error("❌ Population error:", populateError);
            bookings = basicBookings;
            console.log("⚠️ Returning unpopulated bookings");
        }

        // Calculate stats
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
        console.error("Error stack:", error.stack);
        
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