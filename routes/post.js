const route = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const { fireStorage } = require("../firebase-config.js");
const { ref, deleteObject } = require("firebase/storage");


function getPathStorageFromUrl(url) {

    const baseUrl = "https://firebasestorage.googleapis.com/v0/b/project-80505.appspot.com/o/";

    let imagePath = url.replace(baseUrl, "");

    const indexOfEndPath = imagePath.indexOf("?");

    imagePath = imagePath.substring(0, indexOfEndPath);

    imagePath = imagePath.replace("%2F", "/");


    return imagePath;
}

// Create post
route.post("/:id", async (req, res) => {
    if (req.params.id === req.body.userID) {

        const user = await User.findById(req.params.id);

        if (user) {
            try {
                const newPost = new Post({
                    ...req.body
                });

                // console.log(req.body);

                const post = await newPost.save();
                res.status(201).json({ post });

            } catch (err) {
                console.log(err);
                res.status(500).json({ status: "Server error", err });
            }

        } else {
            res.status(404).json({ status: "User not found!" });
        }

    } else {
        res.status(403).json({ status: "You are not autherized for posting" });
    }

})





// Update post
route.put("/:id", async (req, res) => {
    if (req.params.id === req.body.userID) {

        const user = await User.findById(req.params.id);

        if (user) {
            const post = await Post.findById(req.body.postID);
            if (post) {

                try {

                    await Post.findByIdAndUpdate(req.body.postID, {
                        $set: req.body
                    });

                    res.status(202).json({ post });

                } catch (err) {
                    res.status(500).json({ status: "Server error", err });
                }

            } else {
                res.status(404).json({ status: "Post not found" });
            }


        } else {
            res.status(404).json({ status: "User not found!" });
        }

    } else {
        res.status(403).json({ status: "You are not autherized for post updating" });
    }

})


// Delete post
route.delete("/:id", async (req, res) => {
    if (req.params.id === req.body.userID) {

        const user = await User.findById(req.params.id);

        if (user) {
            const post = await Post.findById(req.body.postID);
            if (post) {

                console.log(`post.userID: ${post.userID},  req.body.userID: ${req.body.userID}`);
                if (post.userID === req.body.userID) {
                    try {

                        await Post.findByIdAndDelete(req.body.postID);

                        // Delete from firebase storage
                        const url = getPathStorageFromUrl(post.image);
                        // console.log(url);
                        try {
                            const delref = ref(fireStorage, url);
                            await deleteObject(delref);
                            console.log("[FIREBASE]: Successfully Deleted!");
                        } catch (error) {
                            console.log("[FIREBASE]: " + error);
                        }

                        res.status(200).json({ status: "Post has been deleted!" });

                    } catch (err) {
                        console.log(err);
                        res.status(500).json({ status: "Server error", err });
                    }
                } else {
                    res.status(403).json({ status: "You are not autherized for post deletion" });
                }


            } else {
                res.status(404).json({ status: "Post not found" });
            }


        } else {
            res.status(404).json({ status: "User not found!" });
        }

    } else {
        res.status(403).json({ status: "You are not autherized for post deletion" });
    }

})


// like and dislike a post
route.put("/:id/like", async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (post) {

        // Dislike if it's already has been liked.
        if (post.like.includes(req.body.userID)) {
            try {
                await Post.findByIdAndUpdate(req.params.id, {
                    $pull: { like: req.body.userID }
                });

                res.status(200).json({ status: "Post has been disliked!" });

            } catch (err) {
                res.status(500).json({ status: "Server error", err });
            }

        } else { //Like
            try {
                await Post.findByIdAndUpdate(req.params.id, {
                    $push: { like: req.body.userID }
                });

                res.status(200).json({ status: "Post has been liked!" });

            } catch (err) {
                res.status(500).json({ status: "Server error", err });
            }
        }


    } else {
        res.status(404).json({ status: "Post not found" });
    }
})


// Get all posts of an user
route.get("/:id", async (req, res) => {

    try {

        const post = await Post.find({ userID: req.params.id });

        if (post) {
            if (post.length === 0)
                res.status(200).json([{ _id: "1kb2kjbdhh1hdnjkanskjnkzZ92" }]);
            else
                res.status(200).json(post);
        } else {
            res.status(404).json({ status: "Post not found!" });
        }
    } catch (err) {
        res.status(500).json({ status: "Server error", err });
    }
})

// Get a perticular single post
route.get("/single/:postID", async (req, res) => {
    try {
        const post = await Post.findById(req.params.postID);

        if (post) {
            res.status(200).json(post);

        } else {
            res.status(404).json({ status: "Post not found!" });
        }
    } catch (error) {
        res.status(500).json({ status: "Server error", error });
    }
})


// Get all posts from the database.
route.get("/", async (req, res) => {
    try {
        const allPost = await Post.find({});
        res.status(200).json(allPost);
    } catch (error) {

    }
})


// Get timeline post
route.get("/timeline/:userID", async (req, res) => {

    try {
        const currUser = await User.findById(req.params.userID);
        const userPost = await Post.find({ userID: currUser._id });
        const frndPost = await Promise.all(
            currUser.followings.map((frndid) => {
                return Post.find({ userID: frndid });
            })
        )

        res.status(200).json(userPost.concat(...frndPost));

    } catch (err) {
        res.status(500).json({ status: "Server error", err });
    }


})


// Make comment on a post
route.put("/:id/comment", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post) {

            const comment = {
                commentID: `${Date.now()}`,
                time: Date.now(),
                ...req.body
            }

            try {
                await Post.findByIdAndUpdate(req.params.id, {
                    $push: { comment: comment }
                });
                // post = await Post.findById(req.params.id);
                // res.status(201).json({ status: `${req.body.userID} commented on this post` });
                res.status(201).json({ post });

            } catch (err) {
                res.status(500).json({ status: "server error", err });
            }

        } else {
            res.status(404).json({ status: "Post not found!" });
        }

    } catch (err) {
        res.status(500).json({ status: "server error", err });
    }
})



// Delete comment from a post
route.delete("/:id/comment", async (req, res) => {
    console.log(req.body);
    try {
        const post = await Post.findById(req.params.id);
        if (post) {
            try {
                await Post.findByIdAndUpdate(req.params.id, {
                    $pull: { comment: { commentID: req.body.commentID } }
                })
                res.status(201).json({ status: `Sucessfully deleted postID ${req.params.id}`});

            } catch {
                res.status(500).json({ status: "server error", err });
            }

        } else {
            res.status(404).json({ status: "Post not found!" });
        }
    } catch (err) {
        res.status(500).json({ status: "server error", err });
    }

})


module.exports = route;