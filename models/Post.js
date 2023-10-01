const mongoose = require("mongoose");


const PostSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
    },

    username: {
        type: String,
        required: true,
    },

    profilePicture: {
        type: String,
        default: "",
    },

    desc: {
        type: String
    },

    image: {
        type: Object
    },

    like: {
        type: Array,
        default: []
    },

    comment: {
     type: Array,
     default: []   
    },


}, { timestamps: true });



module.exports = mongoose.model("Post", PostSchema);