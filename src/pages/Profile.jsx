
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { Alert, Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Modal, Paper, Slide, Snackbar, ThemeProvider, Typography, createTheme } from '@mui/material'
import SideDrawer from '../components/SideDrawer'
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import SettingsIcon from '@mui/icons-material/Settings';


import CoverPic from '../assets/adrien-olichon-ilVYjf0J378-unsplash.jpg';
import Share from '../components/Share'
import ProfilePic from '../assets/avatar-1577909_1280.webp'
import Post from '../components/Post'
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useNavigate, useParams } from 'react-router-dom'
import UserTab from '../components/UserTab'
import Account from '../components/Account'
import { useTheme } from '@mui/material/styles';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { followUser, getAllFriends, getUser, getUserPosts, updateUserCover, updateUserProfile } from '../utils/api'


import { Image } from 'antd';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


function copyAndUpdateValues(obj1, obj2) {
  for (let key in obj2) {
      if (obj2.hasOwnProperty(key)) {
          // Check if the key exists in obj1 before updating
          if (obj1.hasOwnProperty(key)) {
              obj1[key] = obj2[key];
          }
      }
  }
  return obj1;
}

const styles = {
  iconButton: {
    bgcolor: 'green',
    color: 'white',
    opacity: 0.5, // Initial opacity
    transition: 'opacity 0.3s',

    '&:hover': {
      bgcolor: 'green', // Change this to the desired hover color
      opacity: 1
    },
  },

  iconButtonCancle: {
    bgcolor: '#007FFF',
    color: 'white',
    opacity: 0.5, // Initial opacity
    transition: 'opacity 0.3s',

    '&:hover': {
      bgcolor: '#007FFF', // Change this to the desired hover color
      opacity: 1
    },
  },

  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.default',
    color: 'text.primary',
    width: 400,
    boxShadow: 24,
    p: 2,
  }
};

function Profile() {
  const [open, setOpen] = useState(false);
  const [openDialouge, setOpenDialouge] = useState(false);
  const [profileIMG, setProfileIMG] = useState(null);
  const [coverIMG, setCoverIMG] = useState(null);

  const handleClickOpenDialouge = () => {
    setOpenDialouge(true);
  };

  const handleCloseDialouge = () => {
    setOpenDialouge(false);
  };


  const themeProvided = useTheme();

  // Dark theme
  const [theme, setTheme] = useState(themeProvided.palette.mode);
  const darkTheme = createTheme({
    palette: {
      mode: theme
    }
  })

  useEffect(() => {
    setTheme(JSON.parse(localStorage.getItem("theme")));
  }, [])


  const params = useParams();
  const receivedData = params.id || '';


  // Edit info modal
  const [openModal, setOpenModal] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  //// ********************** Open Account modal **************************
  const handleAccount = () => {
    handleOpen(true);
    handleCloseUserMenu();
  }

  const handleCloseUserMenu = (e) => {
    setAnchorElUser(null);
  };
  // ********************** END ************************** //





  // ********************** Query Hooks ************************** //
  const queryClient = useQueryClient();

  const queryUser = useQuery({
    queryKey: [`user`, receivedData],
    queryFn: async () => {
      // console.log("receivedData: ", receivedData);
      return await getUser({ ID: receivedData });
    }
  })


  const queryUserPost = useQuery({
    queryKey: [`userpost`, receivedData],
    queryFn: async () => {
      return await getUserPosts({ ID: receivedData });
    }
  })


  const queryUserFriend = useQuery({
    queryKey: [`userfriend`, receivedData],
    queryFn: async () => {
      return await getAllFriends({ ID: receivedData });
    }
  })

  // Update DP
  const queryMutateDP = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (_, variables) => {
      console.log(variables);
      handleClickSuccess();

      // Update the localstorage also.
      const local = JSON.parse(localStorage.getItem("user"));
      const updatedData = copyAndUpdateValues(local, variables.updateData)
      localStorage.setItem("user", JSON.stringify(updatedData));

      queryClient.invalidateQueries({ queryKey: [`user`] });
    },

    onError: (err) => {
      console.log(err);
      alert("DP update failed");
    }
  })

  // Update Cover Pic
  const queryMutateCover = useMutation({
    mutationFn: updateUserCover,
    onSuccess: (_, variables) => {
      handleClickSuccess();

       // Update the localstorage also.
       const local = JSON.parse(localStorage.getItem("user"));
       const updatedData = copyAndUpdateValues(local, variables.updateData)
       localStorage.setItem("user", JSON.stringify(updatedData));
       
      queryClient.invalidateQueries({ queryKey: [`user`] });
    },

    onError: (err) => {
      console.log(err);
      alert("Cover pic update failed!");
    }
  })


  let Qdata = [];

  if (queryUserPost.isSuccess) {
    Qdata = [...queryUserPost.data.data].reverse();

  }

  // console.log(queryUser);
  // console.log(queryUserPost.data.data);
  // console.log(queryUser?.data?.data?.followers[0]);

  // ********************** END *************************** //

  // Trigger file selector.
  function openFileManager1(e) {
    document.getElementById('file1').click();
  }

  function openFileManager2(e) {
    document.getElementById('file2').click();
  }
  //

  // Convert the selected image to an image object in js.
  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const filedata = new FormData();
      filedata.append("image", event.target.files[0]);
      const imgData = {
        bolb: URL.createObjectURL(event.target.files[0]),
        file: filedata
      }
      console.log(event.target.name);
      handleCloseDialouge();
      if (event.target.name === 'file1')
        setProfileIMG(imgData);
      else
        setCoverIMG(imgData);
    }
    else {
      setProfileIMG(null);
      setCoverIMG(null);
    }
  }
  // 



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
    await followUser({ ID: receivedData });
    queryClient.invalidateQueries({ queryKey: [`userfriend`] });
    queryClient.invalidateQueries({ queryKey: [`user`] });
    queryClient.invalidateQueries({ queryKey: ['alluser'] });
    queryClient.invalidateQueries({ queryKey: ['curruser'] });
  }


  // For delete confirm modal
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const handleOpenUploadModal = () => setOpenUploadModal(true);
  const handleCloseModal = () => {
    setProfileIMG(null);
    setCoverIMG(null);
    setOpenUploadModal(false)
  };
  // 


  // Handle confirm DP update function
  const confirmUpdate = () => {
    handleCloseModal();

    if (profileIMG) {
      queryMutateDP.mutate({ userID: queryUser.data.data._id, image: profileIMG.file });
    }

    if (coverIMG) {
      queryMutateCover.mutate({ userID: queryUser.data.data._id, image: coverIMG.file });
    }
  }

  // Snackbar success
  const [openAlertSuccess, setOpenAlertSuccess] = useState(false);

  const handleClickSuccess = () => {
    setOpenAlertSuccess(true);
  };

  const handleCloseSuccess = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlertSuccess(false);
  };

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <Navbar toggleDrawer={toggleDrawer} bgcolor={"background.default"} color={"text.primary"} />

        {/* Main */}
        <Box sx={{ marginTop: 8 }} bgcolor={"background.default"} color={"text.primary"}>
          <Sidebar theme={theme} setTheme={setTheme} />
          <SideDrawer open={open} toggleDrawer={toggleDrawer} />

          {/* Profile Pic and Cover pic and Name */}
          <Box bgcolor={"background.default"} color={"text.primary"} sx={{ flex: { lg: 6, sm: 10, md: 10 }, flexGrow: { xs: 1 }, marginLeft: { lg: "38vh" }, height: "calc(100vh - 64px)", p: { lg: 0, xs: 0, sm: 0 }, placeItems: "center" }}>

            <div className='relative'>
              <div >
                <img className='w-full h-[300px] object-cover' height={200} src={coverIMG?.bolb || queryUser.isSuccess && queryUser?.data.data?.coverPicture || CoverPic} alt="cover" srcset="" />
              </div>

              <div className='absolute left-1/2 transform -translate-x-1/2 top-[66%] rounded-md'>
                <Image
                  style={{ objectFit: "cover", width: 180, height: 180, borderRadius: 2 }}
                  src={profileIMG?.bolb || queryUser.isSuccess && queryUser?.data.data?.profilePicture || ProfilePic}
                />
                <div className='absolute right-0 bottom-0 text-slate-600 text-3xl transform -translate-x-[-50%] cursor-pointer'>
                  {/* Your update picture button goes here */}
                  {(!profileIMG && !coverIMG) && queryUser.isSuccess && queryUser.data.data._id === (JSON.parse(localStorage.getItem("user"))._id)   
                  ? 
                  <IconButton size='small' sx={styles.iconButton} onClick={handleClickOpenDialouge}>
                    <CameraAltIcon />
                  </IconButton> :
                    (queryUser.isSuccess && queryUser.data.data._id === (JSON.parse(localStorage.getItem("user"))._id) && <IconButton size='small' sx={styles.iconButtonCancle} onClick={handleOpenUploadModal}>
                      <CloudSyncIcon />
                    </IconButton>)
                  }

                  {/* Hidden File Manager */}
                  <input className='hidden' type="file" name="file1" id="file1" onChange={onImageChange} accept="image/*" />
                  <input className='hidden' type="file" name="file2" id="file2" onChange={onImageChange} accept="image/*" />
                </div>
              </div>


            </div>

            <div className='mt-20 text-center'>
              <p className='text-xl font-bold' style={{ color: "text.primary" }}>{queryUser.isSuccess && queryUser?.data.data?.username}</p>
              <p className='text-sm font-semibold ' style={{ color: "text.primary" }}>{queryUser.isSuccess && queryUser?.data.data?.desc}</p>

              {receivedData === JSON.parse(localStorage.getItem("user"))?._id
                && <Button onClick={handleAccount} startIcon={<SettingsIcon />} className='float-right' variant='contained' size='small' sx={{ marginRight: 1 }}>Edit info</Button>}
            </div>


            <Box bgcolor={"background.default"} color={"text.primary"} sx={{ display: "flex", marginTop: { xs: 5, md: 5 }, marginLeft: { md: 2 }, gap: 4, p: { xs: 1 } }}>
              {/* User feed */}
              <Box sx={{ flex: 1.5 }} bgcolor={"background.default"} color={"text.primary"}>
                {queryUser.isSuccess && JSON.parse(localStorage.getItem("user"))?._id === queryUser?.data.data?._id && <Share />}

                {/* All posts of an user */}
                {queryUserPost.isSuccess && Qdata.length > 1 ? Qdata.map((item, ind) => {
                  if (item?._id !== "1kb2kjbdhh1hdnjkanskjnkzZ92")
                    return <Post key={ind} data={item} />
                })
                  :
                  <div className="rounded-lg p-4 text-center text-3xl font-bold text-shadow-md opacity-30 hover:cursor-copy">
                    No Post 📭
                  </div>

                }
              </Box>

              {/* User info */}
              <Box sx={{ flex: 1, display: { xs: "none", md: "block" } }}>
                <Paper square={false} sx={{ p: 2 }}>
                  <div className='mb-10'>
                    <div className='flex justify-between'>
                      <p className='text-lg font-bold '>User Information</p>

                      {receivedData !== JSON.parse(localStorage.getItem("user"))?._id &&
                        (queryUser.isSuccess && !queryUser.data.data.followers.includes(JSON.parse(localStorage.getItem("user"))._id)
                          ? <Button onClick={handleFollowUser} startIcon={<AddIcon />} variant="contained" size='medium' sx={{ marginTop: 1, textTransform: "none" }}>Follow</Button>
                          : <Button onClick={handleFollowUser} startIcon={<ClearIcon />} variant="contained" size='medium' sx={{ marginTop: 1, textTransform: "none" }}>Unfollow</Button>)}

                    </div>

                    <div className='space-y-1 mb-5'>
                      <p className='font-semibold '>City: <span className='font-medium '>{queryUser.isSuccess && queryUser.data.data?.city}</span></p>
                      <p className='font-semibold '>From: <span className='font-medium '>{queryUser.isSuccess && queryUser.data.data?.from}</span></p>
                      <p className='font-semibold '>Relationship: <span className='font-medium '>{queryUser.isSuccess && queryUser.data.data?.relationship}</span></p>
                    </div>

                    <div className='flex gap-5 font-semibold  text-center justify-center translate-y-[80%]'>
                      <div>
                        <p>{queryUserPost.isSuccess && queryUserPost.data.data.length}</p>
                        <p>Posts</p>
                      </div>

                      <div>
                        <p>{queryUserFriend.isSuccess && queryUserFriend.data.data?.followers.length}</p>
                        <p>Followers</p>
                      </div>

                      <div>
                        <p>{queryUserFriend.isSuccess && queryUserFriend.data.data?.followigns.length}</p>
                        <p>Following</p>
                      </div>
                    </div>
                  </div>
                </Paper>


                <div className='mb-10 mt-5'>
                  <Paper sx={{ p: 1 }} >
                    {queryUserFriend.isSuccess &&
                      <UserTab userID={receivedData} friends={queryUserFriend.isSuccess && queryUserFriend.data.data} />}
                  </Paper>
                </div>

              </Box>

            </Box>

          </Box>

          {/* Edit Account info Modal */}
          {queryUser.isSuccess && <Account
            user={queryUser.data.data}

            openModal={openModal}
            setOpenModal={setOpenModal}
            handleOpen={handleOpen}
            handleClose={handleClose}
          />}


          {/* Change Picture Dialouge */}
          <Dialog
            open={openDialouge}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseDialouge}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>{"Change the picture"}</DialogTitle>
            <DialogContent>
              <div onClick={openFileManager1} className='border-[2px] border-black mb-2 p-1 text-center rounded-md hover:cursor-pointer transition-all delay-[20ms] hover:border-[2px] hover:border-dotted hover:border-indigo-500'>Change Profile Image</div>
              <div onClick={openFileManager2} className='border-[2px] border-black p-1 text-center rounded-md hover:cursor-pointer transition-all delay-[20ms] hover:border-[2px] hover:border-dotted hover:border-indigo-500'>Change Cover Image</div>
            </DialogContent>

          </Dialog>
        </Box>
      </ThemeProvider >

      {/* Delete Confirmation Modal */}
      <Modal
        open={openUploadModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styles.modal}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure ?
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Selecting 'OK' will result in the permanent update of the post, while choosing 'Cancel' will abort the process.
          </Typography>

          <div className='float-right'>
            <Button onClick={handleCloseModal} size='small'>reset</Button>
            <Button onClick={confirmUpdate} size='small'>ok</Button>
          </div>
        </Box>
      </Modal>
      
      {/* Snakbar after successfull completion */}
      <Snackbar open={openAlertSuccess} autoHideDuration={6000} onClose={handleCloseSuccess} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          Picture Updated Successfully 🎉
        </Alert>
      </Snackbar>
    </>
  )
}

export default Profile
