const mongoose = require('mongoose');
const bycrpt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: {type: String, required: true},
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    pic: {
        type: String, 
        required: true, 
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    }
}, {timestamps: true})

const User = mongoose.model("User", UserSchema);

module.exports = User