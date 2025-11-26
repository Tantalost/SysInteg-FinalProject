import User from '../models/Users.js';

// GET /api/user
export const getUserData = async (req, res) => {
    try {
        const role = req.user.role;
        const recentSearchRooms = req.user.recentSearchRooms;
        res.json({ sucess: true, role, recentSearchRooms })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Store user recent search rooms
export const storeRecentSearchRooms = async (req, res) => {
    try {
        const { recentSearchRooms } = req.body;
        const user = await req.user;

        if (user.recentSearchRooms.length < 2) {
            user.recentSearchRooms.push(recentSearchRooms)
        } else {
            user.recentSearchRooms.shift();
            user.recentSearchRooms.push(recentSearchRooms)
        }
        await user.save();
        res.json({ success: true, message: "Room added" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const createUser = async (req, res) => {
    try {
        const { userId } = req.auth(); 
        const { username, email, image } = req.body; 

        let user = await User.findById(userId);

        if (!user) {
            user = await User.create({
                _id: userId,
                username,
                email,
                image
            });
        }

        res.json({ success: true, message: "User created/found" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// PATCH /api/user/make-admin/:id
export const promoteToAdmin = async (req, res) => {
    try {
        const requester = req.user; // comes from your protect middleware
        if (requester.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        user.role = 'admin';
        await user.save();

        res.json({ success: true, message: `${user.username} is now an admin` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/users/count - Get total user count
export const getUserCount = async (req, res) => {
    try {
        const count = await User.countDocuments();
        res.json({ success: true, count });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};