const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },

    username: {
        type: String,
        default: ""
    },

    profilePicture: {
        type: String,
        default: ""
    },

    text: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: ["like", "follow", "post", "comment"]
    }

}, { timestamps: true })



module.exports = mongoose.model("Notification", NotificationSchema);