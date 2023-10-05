const route = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");


// Update user
route.put("/:id", async (req, res) => {
    if (req.body.userID === req.params.id || req.body.isAdmin) {

        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {

                res.status(500).json({ status: "Server error", err: err });
            }
        }

        try {
            const user = await User.findByIdAndUpdate(req.body.userID, {
                $set: req.body
            });

            res.status(202).json({ status: "User updated!", user: user });

        } catch (err) {
            console.log(err);
            res.status(403).json({ status: "Update failed!", err: err });
        }


    } else {
        res.status(403).json({ status: "You are unautherrized!" });
    }
})


// Delete user
route.delete("/:id", async (req, res) => {
    if (req.body.userID === req.params.id || req.body.isAdmin) {

        try {
            const user = await User.deleteOne({ _id: req.params.id });
            res.status(202).json({ status: "User has been deleted successfully" });

        } catch (err) {

            res.status(403).json({ status: "Delete failed!", err: err });
        }


    } else {
        res.status(403).json({ status: "You are unautherrized!" });
    }
})


// Get a User
route.get("/:id", async (req, res) => {

    try {
        const user = await User.findById(req.params.id);
        if (user) {
            const { password, updatedAt, ...compress } = user._doc;
            res.status(200).json(compress);
        }
        else
            res.status(404).json({ status: "No user found with that id" });

    } catch (err) {
        res.status(500).json({ status: "Internal server error", err: err });
    }



})

// Get all user
route.get("/", async (req, res) => {
    try {
        const user = await User.find({ _id: { $ne: req.params._id } });
        res.status(200).json(user);

    } catch (err) {
        res.status(500).json({ status: "Internal server error", err: err });
    }
})



// Follow a user
route.put("/:id/follow", async (req, res) => {

    if (req.params.id !== req.body.userID) {

        try {
            const user = await User.findById(req.params.id); // Other user.
            const currUser = await User.findById(req.body.userID); // Current user.

            // If not following then follow the user.
            if (!currUser.followings.includes(req.params.id)) {

                try {
                    await currUser.updateOne({ $push: { followings: req.params.id } });
                    await user.updateOne({ $push: { followers: req.body.userID } });

                    res.status(202).json({ status: `You are now following user ${user.username}` });

                } catch (err) {
                    res.status(500).json({ status: "Internal server error cant't follow", err: err });
                }

            } else { // Unfollow the user.
                try {
                    await currUser.updateOne({ $pull: { followings: req.params.id } });
                    await user.updateOne({ $pull: { followers: req.body.userID } });

                    res.status(202).json({ status: `You are now unfollowing user ${user.username}` });

                } catch (err) {
                    res.status(500).json({ status: "Internal server error cant't follow", err: err });
                }

                // res.status(403).json({ status: `You already follow the user ${user.username}` });
            }

        } catch (err) {
            res.status(500).json({ status: "Internal server error", err: err });
        }

    } else {
        res.status(403).json({ status: "You can't follow yourself" });
    }

})


// Unfollow user
route.put("/:id/unfollow", async (req, res) => {

    if (req.params.id !== req.body.userID) {

        try {
            const user = await User.findById(req.params.id);
            const currUser = await User.findById(req.body.userID);

            if (currUser.followings.includes(req.params.id)) {
                try {
                    await currUser.updateOne({ $pull: { followings: req.params.id } });
                    await user.updateOne({ $pull: { followers: req.body.userID } });

                    res.status(202).json({ status: `You are now unfollowing user ${req.params.id}` });

                } catch (err) {
                    res.status(500).json({ status: "Internal server error cant't unfollow", err: err });
                }
            } else {
                res.status(403).json({ status: "You're not following the user" });
            }

        } catch (err) {
            res.status(500).json({ status: "Internal server error", err: err });
        }

    } else {
        res.status(403).json({ status: "You can't unfollow yourself" });
    }

})


// Get all followers/followigns users
route.get("/:id/friends", async (req, res) => {
    const user = await User.findById(req.params.id);
    // console.log(user.followers);

    if (user) {
        try {
        
            const followigns = await Promise.all(
                user.followings.map((userID) => {
                    return User.find({ _id: userID });
                })
            )

            const followers = await Promise.all(
                user.followers.map((userID) => {
                    return User.find({ _id: userID });
                })
            )

            // console.log(friends);
            res.status(200).json({followers, followigns});
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: "Internal Server Error" });
        }
    } else {
        res.status(404).json({ status: `No user found with id: ${req.params.id}` })
    }
})



module.exports = route;