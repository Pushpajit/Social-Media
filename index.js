const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require('cors');

const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const postRoute = require("./routes/post");
const uploadRoute = require("./routes/upload");

const app = express();
dotenv.config();


// Connect database
async function connectToDatabase(){
    try{
        const connection = await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to the database!");
    }catch(err){
        console.log(`[ERROR]: ${err}`);
    }
    
}connectToDatabase();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("common"));
app.use(cors());


app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use("/api/upload", uploadRoute);


app.get("/", (req, res) => {
    res.send("This is home page");
})

app.listen(8800, () => {
    console.log("Backend server started localhost:8800");
})