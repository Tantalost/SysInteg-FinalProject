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
        const { userId } = req.auth; 
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