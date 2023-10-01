
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { Box, Button, Paper } from '@mui/material'
import SideDrawer from '../components/SideDrawer'
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import CoverPic from '../assets/adrien-olichon-ilVYjf0J378-unsplash.jpg';
import Share from '../components/Share'
import ProfilePic from '../assets/avatar-1577909_1280.webp'
import Post from '../components/Post'
import { PUBLIC_URL } from '../PUBLIC_URL';
import { useLocation, useParams } from 'react-router-dom'
import UserTab from '../components/UserTab'


// Get all posts of the user.
async function getUserPosts(userID) {
  // const data = JSON.parse(localStorage.getItem("user"));
  const endpoint = `${PUBLIC_URL}/post/` + userID;

  let res = await fetch(endpoint, {
    method: "GET",
    headers: {
      'Content-type': 'application/json'
    }
  });

  res = await res.json();
  return res;
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

// ALl friends of the user
async function getAllFriends(ID) {
  const endpoint = `${PUBLIC_URL}/user/${ID}/friends`;

  let res = await fetch(endpoint, {
    method: "GET",
    headers: {
      'Content-type': 'application/json'
    }
  });

  res = await res.json();

  // console.log("user friend: " + res);

  return res;

}


function Profile() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]); // data means posts of the user.

  const location = useLocation(); // Import useLocation from react-router-dom
  const params = useParams();
  const receivedData = params.id || '';



  // console.log("receivedData: ", receivedData);
  // console.log(currentUser);

  

  useEffect(() => {
    console.count("Render Count");

    async function initUser() {
      if (!user && receivedData) {
        const data = await getUser(receivedData);
        // console.log("user: ", data);
        
        setUser(data);
      }

    } initUser()


    if (data.length === 0 && user) {
      getUserPosts(user?._id)
        .then(data => setData(data.reverse()))
        .catch(err => alert(err));
    }


  }, [data, user])

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setOpen(open);
  };


  // Handle follow user
  const handleFollowUser = async () => {
    await followUser(user?._id);
    setUser(null);
  }

  return (
    <>
      <Navbar toggleDrawer={toggleDrawer} />

      {/* Main */}
      <Box sx={{ marginTop: 8 }}>
        <Sidebar />
        <SideDrawer open={open} toggleDrawer={toggleDrawer} />

        {/* Profile Pic and Cover pic and Name */}
        <Box sx={{ flex: { lg: 6, sm: 10, md: 10 }, flexGrow: { xs: 1 }, marginLeft: { lg: "40vh" }, height: "calc(100vh - 64px)", p: { lg: 0, xs: 0, sm: 0 }, placeItems: "center" }}>

          <div className='relative'>
            <div >
              <img className='w-full h-[300px] object-cover' height={200} src={user?.coverPicture || CoverPic} alt="cover" srcset="" />
            </div>

            <div className='absolute left-[50%] top-[66%] translate-x-[-50%] cursor-pointer' >
              <img className='h-[180px] w-[180px] object-cover border-[3px] border-white' src={user?.profilePicture || ProfilePic} alt="dp" srcset="" style={{ borderRadius: "50%" }} />
            </div>

          </div>

          <div className='mt-20 text-center'>
            <p className='text-xl font-bold text-slate-700'>{user?.username}</p>
            <p className='text-sm font-semibold text-slate-500'>{user?.desc}</p>
          </div>


          <Box sx={{ display: "flex", marginTop: { xs: 5, md: 5 }, marginLeft: { md: 2 }, gap: 4, p: { xs: 1 } }}>
            {/* User feed */}
            <Box sx={{ flex: 1.5 }}>
              {JSON.parse(localStorage.getItem("user"))?._id === user?._id && <Share setData={setData} />}

              {/* All posts of an user */}
              {data.map((item, ind) => {
                if (item?._id !== "1kb2kjbdhh1hdnjkanskjnkzZ92")
                  return <Post key={ind} data={item} setData={setData} />
              })}
            </Box>

            {/* User info */}
            <Box sx={{ flex: 1, display: { xs: "none", md: "block" } }}>
              <Paper square={false} sx={{ p: 2 }}>
                <div className='mb-10'>
                  <div className='flex justify-between'>
                    <p className='text-lg font-bold text-slate-700'>User Information</p>

                    {receivedData !== JSON.parse(localStorage.getItem("user"))?._id &&
                      (!user?.followers.includes(JSON.parse(localStorage.getItem("user"))._id)
                        ? <Button onClick={handleFollowUser} startIcon={<AddIcon />} variant="contained" size='medium' sx={{ marginTop: 1, textTransform: "none" }}>Follow</Button>
                        : <Button onClick={handleFollowUser} startIcon={<ClearIcon />} variant="contained" size='medium' sx={{ marginTop: 1, textTransform: "none" }}>Unfollow</Button>)}

                  </div>

                  <div className='space-y-1 mb-5'>
                    <p className='font-semibold text-slate-800'>City: <span className='font-medium text-slate-500'>{user?.city}</span></p>
                    <p className='font-semibold text-slate-800'>From: <span className='font-medium text-slate-500'>{user?.form}</span></p>
                    <p className='font-semibold text-slate-800'>Relationship: <span className='font-medium text-slate-500'>{user?.relationship}</span></p>
                  </div>

                  <div className='flex gap-5 font-semibold text-slate-800 text-center justify-center translate-y-[80%]'>
                    <div>
                      <p>{data?.length}</p>
                      <p>Posts</p>
                    </div>

                    <div>
                      <p>{user?.followers.length}</p>
                      <p>Followers</p>
                    </div>

                    <div>
                      <p>{user?.followings.length}</p>
                      <p>Following</p>
                    </div>
                  </div>
                </div>
              </Paper>


              <div className='mb-10 mt-5'>
                <Paper sx={{ p: 1 }}>
                  
                  <UserTab userID={receivedData}/>
                </Paper>
              </div>

            </Box>

          </Box>

        </Box>
      </Box>
    </>
  )
}

export default Profile
