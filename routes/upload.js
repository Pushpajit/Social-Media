const multer = require('multer');
const route = require("express").Router();
const { ref, uploadBytesResumable, getDownloadURL, uploadBytes } = require("firebase/storage");
const { fireStorage } = require("../firebase-config.js");


const giveCurrentDateTime = () => {
  const today = new Date();
  const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + ' ' + time;
  return dateTime;
}

const upload = multer({ storage: multer.memoryStorage() });

// Upload file
route.post("/", upload.single("image"), async (req, res) => {
  console.log(req.file);
  const dateTime = giveCurrentDateTime();

  try {

    const filename = req.file.filename;
    const filepath = req.file.path;


    console.log(`firename: ${filename}, filepath: ${filepath}, storage: ${fireStorage}`);
    // creating storage ref
    const storageRef = ref(fireStorage, `files/${req.file.originalname + "       " + dateTime}`);


    // Create file metadata including the content type
    const metadata = {
      contentType: req.file.mimetype,
    };


    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
    //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel


    // Grab the public url
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("downloadURL", downloadURL);
    req.body.image = downloadURL;

    res.status(200).json({ downloadURL });
  } catch (error) {
    res.status(500).json({ error });
  }
})


module.exports = route;