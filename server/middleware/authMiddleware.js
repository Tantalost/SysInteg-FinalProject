import User from '../models/Users.js';

export const protect = async (req, res, next) => {
    try {
        const { userId } = req.auth();

        if (!userId) {
            return res.json({ success: false, message: "Not Authorized. Login Again." });
        }
        const user = await User.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        req.user = user;
        next();

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}