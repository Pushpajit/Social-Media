const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },

    email: {
        type: String,
        require: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
        min: 5,
    },

    profilePicture: {
        type: String,
        default: "",
    },

    coverPicture: {
        type: String,
        default: "",
    },

    followers: {
        type: Array,
        default: [],
    },

    followings: {
        type: Array,
        default: [],
    },

    isAdmin: {
        type: Boolean,
        default: false,
    },

    desc: {
        type: String,
        max: 50,
    },

    city: {
        type: String,
        max: 50,
    },

    from: {
        type: String,
        max: 50,
    },

    relationship: {
        type: String,
        enum: ["Single", "Complex", "Married"],
    },

}, { timestamps: true });



module.exports = mongoose.model("User", UserSchema);