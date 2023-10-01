import { Avatar, Badge, Box, Button, Divider, IconButton, Paper } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { PUBLIC_URL } from '../PUBLIC_URL';
import { useNavigate } from 'react-router-dom';

// Get all users
async function getAllUsers(userID) {

    const endpoint = `${PUBLIC_URL}/user?_id=` + userID;

    let res = await fetch(endpoint, {
        method: "GET",
        headers: {
            'Content-type': 'application/json'
        }
    });

    res = await res.json();
    return res;
}

// Follow/Unfollow a user
async function followUser(ID) {
    const currUser = JSON.parse(localStorage.getItem("user"));
    const endpoint = `${PUBLIC_URL}/user/${ID}/follow`;

    const payload = {
        userID: currUser?._id
    }

    let res = await fetch(endpoint, {
        method: "PUT",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    res = await res.json();
    alert(res.status);

}


// Get perticular user.
async function getUser(ID) {
    const endpoint = `${PUBLIC_URL}/user/` + ID;

    console.log("getUser ID: ", ID);
    let res = await fetch(endpoint, {
        method: "GET",
        headers: {
            'Content-type': 'application/json'
        }
    });
    // console.log("response: ", res);

    if (res.status === 404 || res.status == 505) {
        alert("User not exits 🚫 or Server error 💀");
        return;
    }
    res = await res.json();
    return res;
}



function Rightbar() {
    const [user, setuser] = useState(null);
    const [allusers, setAllusers] = useState([]);
    const navigate = useNavigate();


    // console.log(user);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("user"));

        if (!user) {
            getUser(data?._id)
            .then(currUser => setuser(currUser))
            .catch(err => console.log(err));
        }

        if (user) {
            getAllUsers(user?._id)
                .then(users => setAllusers(users))
                .catch(err => console.log(err));
        }
    }, [user])


    //Handle profile view
    const handleProfileView = (userID) => {
        navigate('/profile', { state: { data: userID } });
    }
    // 


    // Handle follow/unfollow friend
    const handleFollowUser = async (userID) => {
        await followUser(userID);
        setuser(null);

    }


    return (
        <Box className='space-y-5' sx={{ flex: 3, display: { xs: "none", sm: "none", md: "block" }, paddingTop: 5, paddingLeft: 2, paddingRight: 2 }}>
            {/* Suggested friends */}
            <Paper sx={{ p: 1 }}>

                <p className='text-slate-400 text-sm mb-5'>Suggestions for you</p>

                {/* Peoples */}
                {
                    allusers.map((item, ind) => {
                        // console.log(`${item.username}: ${item.followings}`);
                        if (!(user?.followings.includes(item?._id)) && item?._id !== user?._id) {

                            return <div className='mb-1' key={ind}>
                                <div className='flex justify-between items-center'>
                                    <div className='space-x-3 flex items-center'>
                                        <IconButton onClick={() => handleProfileView(item._id)}>
                                            <Avatar src={item?.profilePicture} sizes='small' />
                                        </IconButton>
                                        <p onClick={() => handleProfileView(item._id)} className='font-semibold text-slate-700 text-sm hover:cursor-pointer hover:text-[#1976D2]'>{item?.username}</p>
                                    </div>

                                    <div className='flex space-x-2'>
                                        <Button onClick={() => handleFollowUser(item?._id)} variant='contained' size='small' sx={{ width: 75, height: 30 }}>Follow</Button>
                                        <Button variant='contained' size='small' sx={{ width: 75, height: 30 }} color='secondary'>Dismiss</Button>
                                    </div>
                                </div>
                            </div>

                        }

                    })
                }


            </Paper>


            {/* Online friends */}
            <Paper sx={{ p: 1 }}>
                <p className='text-slate-400 text-sm mb-5'>Online friends</p>

                <Box className='space-y-2 cursor-pointer'>
                    <div className='flex gap-3 items-center'>
                        <Badge variant='dot' overlap="circular" color='success'>
                            <Avatar />
                        </Badge>
                        <p className='text-sm font-semibold'>Lena Froster</p>
                    </div>
                </Box>
            </Paper>
        </Box>
    )
}

export default Rightbar
