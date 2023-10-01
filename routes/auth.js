const route = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Login
route.post("/login", async (req, res) => {
    console.log(`email: ${req.body.email}`);
    try {
        const user = await User.findOne({ email: req.body.email});

        if (!user) {
            res.status(404).json({code: 400, status: "No user found" });
        }
        else {
            const isVarified = await bcrypt.compare(req.body.password, user.password);

            if (isVarified)
                res.status(200).json({code: 200, user: user});
            else
                res.status(400).json({code: 400,  status: "Password is incorrect" });
        }

    } catch (err) {
        res.status(500).json({code: 500, status: "Internal server error", error: err })
    }
})


// Register
route.post("/register", async (req, res) => {
    try {
        // Hash password.
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        // Create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashPassword
        });

        // Save user into database and send response
        const user = await newUser.save();
        res.status(201).json({code:201, user: user});

    } catch (err) {
        console.log(Object.keys(err.keyPattern)[0]);
        
        if(Object.keys(err.keyPattern)[0] === 'username')
            res.json({code:400, statusText: "Username Already Exists"});
    
        if(Object.keys(err.keyPattern)[0] === 'email')
            res.json({code: 400, statusText: "Email Already Exists"});
    
    }


})


module.exports = route;