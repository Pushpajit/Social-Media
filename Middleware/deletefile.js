const { ref, uploadBytesResumable, getDownloadURL, uploadBytes } = require("firebase/storage");
const { storage } = require("../firebase-config.js");


const fileDelete = async (req, res, next) => {

  next();
}


module.exports = fileDelete;