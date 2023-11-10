import { PUBLIC_URL } from "../PUBLIC_URL";
import axios from 'axios'


// Get all post from the database
export async function getAllPosts() {

    const endpoint = `${PUBLIC_URL}/post/`;

    let res = await axios(endpoint);

    // console.log(res);
    return res;
}


// Get a perticular single post
export async function getSinglePost(postID) {
    const endpoint = `${PUBLIC_URL}/post/single/${postID}`;
    const res = await axios(endpoint);

    return res;
}



export async function makeComment(data) {
    const user = JSON.parse(localStorage.getItem("user"));

    const endpoint = `${PUBLIC_URL}/post/${data.id}/comment`;

    const payload = {
        userID: user?._id,
        text: data.text,
        username: user?.username
    }

    // console.log(payload);

    const res = await axios.put(endpoint, payload);

    // console.log(res);

    return res;

}



export async function deleteComment(data) {
    // console.log(data);
    const endpoint = `${PUBLIC_URL}/post/${data.postID}/comment`;

    const payload = {
        commentID: data.commentID
    }

    const res = await axios.delete(endpoint, {
        headers: {
            'Content-type': 'application/json'
        },
        data: JSON.stringify(payload)
    });

    return res;
}


// Get all posts of the user.
export async function getUserPosts(data) {
    // const data = JSON.parse(localStorage.getItem("user"));
    console.log(data);
    const endpoint = `${PUBLIC_URL}/post/` + data.ID;

    const res = await axios(endpoint);
    // console.log(res);
    return res;
}


// Get perticular user.
export async function getUser(data) {
    const endpoint = `${PUBLIC_URL}/user/` + data.ID;
    const res = await axios(endpoint);
    console.log(res);
    
    return res;
}


// ALl friends of the user
export async function getAllFriends(data) {
    const endpoint = `${PUBLIC_URL}/user/${data.ID}/friends`;

    const res = await axios(endpoint);
    // console.log(res);
    // console.log("user friend: " + res);

    return res;

}


// Follow/Unfollow a user
export async function followUser(data) {
    const currUser = JSON.parse(localStorage.getItem("user"));
    const endpoint = `${PUBLIC_URL}/user/${data.ID}/follow`;

    const payload = {
        userID: currUser?._id
    }

    const res = await axios.put(endpoint, payload);
    // console.log(res);
    return res;


}

// To deletea post of the user
export async function deletePost(data) {
    const user = JSON.parse(localStorage.getItem("user"));
    const endpoint = `${PUBLIC_URL}/post/${user?._id}`;

    const payload = {
        userID: user?._id,
        postID: data.postID
    }

    // console.log(payload);

    let res = await axios.delete(endpoint, {
        headers: {
            'Content-type': 'application/json'
        },

        data: JSON.stringify(payload)
    });

    // if (res.ok)
    //   alert("Post deleted!");
    // else if(res.status === 403)
    //   alert("You cannot delete the post!");
    // else
    //   alert(res.statusText);

    // console.log(res);

    return res;

}


async function uploadFile(image) {
    const endpoint = `${PUBLIC_URL}/upload`;

    let res = await fetch(endpoint, {
        method: "POST",
        body: image
    })


    if (res.ok) {
        res = await res.json();
        // console.log(res);
        // alert("File uploaded!");
        return res;
    } else {
        alert("File not uploaded!");
        return null;
    }
}


export async function createPost(data) {
    console.log(data);
    const user = JSON.parse(localStorage.getItem("user"));
    const endpoint = `${PUBLIC_URL}/post/` + user._id;

    const imgURL = await uploadFile(data.image);

    if (!imgURL) {
        throw new Error("Image Upload Failed!");
    }

    const payload = {
        username: user.username,
        profilePicture: user.profilePicture,
        userID: user._id,
        desc: data.desc,
        image: imgURL.downloadURL || ""
    }

    // console.log("payload: ", payload);

    let res = await axios.post(endpoint, payload);
    console.log(res);


    return res;

}

// Update profile picture
export async function updateUserProfile(data) {
    const endpoint = `${PUBLIC_URL}/user/${data.userID}/`;

    const imgURL = await uploadFile(data.image);

    if (!imgURL) {
        throw new Error("Image Upload Failed!");
    }

    const payload = {
        userID: data.userID,
        profilePicture: imgURL.downloadURL
    }

    // console.log(payload);

    const res = await axios.put(endpoint, payload);
    console.log(res);
    if(res.status === 202 || res?.data?.user){
        localStorage.setItem("user", JSON.stringify(res?.data.user));
    }
    return res;

}


// Update cover picture
export async function updateUserCover(data) {
    const endpoint = `${PUBLIC_URL}/user/${data.userID}/`;

    const imgURL = await uploadFile(data.image);

    if (!imgURL) {
        throw new Error("Image Upload Failed!");
    }

    const payload = {
        userID: data.userID,
        coverPicture: imgURL.downloadURL
    }

    // console.log(payload);

    const res = await axios.put(endpoint, payload);
    console.log(res);
    if(res.status === 202 || res?.data?.user){
        localStorage.setItem("user", JSON.stringify(res?.data.user));
    }
    return res;

}


// update a user
export async function updateUser(data) {
    // console.log(data);
    const endpoint = `${PUBLIC_URL}/user/${data.userID}/`;


    const payload = {
        userID: data.userID,
        ...data.updateData
    }

    let res = await fetch(endpoint, {
        method: "PUT",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        console.log(res);
        throw new Error(res.statusText);
    }

    res = await res.json();
    // console.log(res);

    if (res?.user)
        localStorage.setItem("user", JSON.stringify(res?.user));
    // alert(res.status);

    return true;

}


// Get all users
export async function getAllUsers(userID) {
    const endpoint = `${PUBLIC_URL}/user?_id=` + userID;
    const res = await axios.get(endpoint);

    return res;
}


