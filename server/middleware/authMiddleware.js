import User from '../models/Users.js';

// Middle to check if user is authenticated
export const protect = async (req, res, next)=> {
    const {userId} = req.auth;
    if(!userId){
        res.json({success: false, message: "User is not authenticated"});
    }else{
        const user = await User.findById(userId);
        req.user = user;
        next()
    }

}