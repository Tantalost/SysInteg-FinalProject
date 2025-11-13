import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    __id: {type: String, required: true},
    username: {type: String, required: true},
    email: {type: String, required: true},
    image: {type: String},
    role: {type: String, enum: ['user', 'admin'], default: 'user'},
    recentSearchRooms: [{type: String}],
}, {timestamps: true}
);

const User = mongoose.model('User', userSchema);
export default User;