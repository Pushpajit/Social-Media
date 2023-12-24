import { Alert, Avatar, Button, Divider, Paper, Popover, Slide, Snackbar, TextField } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PlaceIcon from '@mui/icons-material/Place';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SendIcon from '@mui/icons-material/Send';
import React, { useEffect, useState } from 'react'
import EmojiPicker from 'emoji-picker-react';
import { useTheme } from '@mui/material/styles';

import MDEditor from '@uiw/react-md-editor';

import 'react-quill/dist/quill.snow.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '../utils/api';


function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}


function Share(props) {
  const [image, setImage] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [upload, setUpload] = useState(false);
  const [user, setuser] = useState(null);
  const themeProvided = useTheme();
  // Rich text editor
  const [content, setContent] = useState("");
  // 

 // ********************** Query Hooks ************************** //
  const queryClient = useQueryClient();
  const queryPost = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["allPost"]});
      queryClient.invalidateQueries({queryKey: ['userpost', JSON.parse(localStorage.getItem("user"))._id ]});
      setContent("");
      setImage(null);
      handleClickSuccess();
    },

    onError: (err) => {
      alert("[UPLOAD FAILED]: ", err);
    }
  })

  // ********************** END *************************** //


  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    if (!user)
      setuser(data);

  }, [user])


  // Trigger file selector.
  function openFileManager(e) {
    document.getElementById('file3').click();
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
      setImage(imgData);
      setUpload(true);
    }
    else {
      setImage(null);
      setUpload(false);
    }
  }
  // 


  // Popover functions
  const handleOpenPop = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };


  const handleClosePop = () => {
    setAnchorEl(null);
  };

  const openPop = Boolean(anchorEl);
  const id = openPop ? 'simple-popper' : undefined;
  // 


  // To handle emoji.
  function handleEmoji(e) {
    setContent(prev => prev + e.emoji);
  }
  // 


  // Create Post
  const handlePost = () => {
    // console.log(content, image);
    // Regular exp to check the content is not containing any whitesspaces/new line chars/empty strings
    if ((/^[\s\n]*$/.test(content)) && image === null)
      return;

    queryPost.mutate({image: image?.file, desc: content});
  }
  // 

  


  // Delete a file
  const handleDelete = async () => {
    setUpload(false);
    setImage(null);
  }
  // 


  // ********************** Snackbar success ***********************
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
  // *******************END*****************************************
  // Setting the EDMarkdown editor theme light
  document.documentElement.setAttribute('data-color-mode', themeProvided.palette.mode);


  return (
    <div>
      <Paper elevation={2} sx={{ width: { xs: "100%", sm: "100%" }, marginBottom: 5 }}>
        {/* Top section */}
        <div className='flex gap-2 '>
          {/* <Avatar src={user?.profilePicture || ProfilePic} sx={{ cursor: "pointer" }}></Avatar> */}
          {/* Text Editor */}
          {/* <TextField onChange={(e) => {console.log(e.target.value); setCaption(e.target.value)}} value={caption} size='small' sx={{ width: { xs: "100%" }, textTransform: "none" }} inputProps={{autoCorrect: 'off'}} fullWidth multiline placeholder='Share a post'></TextField> */}
          <div className='w-full'>

            <MDEditor
              value={content}
              onChange={setContent}
              style={{ height: 50 }}
            />

          </div>

        </div>

        <Divider />

        {/* Photo and video section here */}
        <img src={image?.bolb} alt="" />



        {/* Bottom section */}
        <div className='flex justify-between items-center relative'>

          <div className='flex sm:gap-5 justify-between sm:ml-16 ml-12 p-2'>
            {!image ? <Button onClick={openFileManager} size='large' color='success' startIcon={<PhotoLibraryIcon />}>
              <p className='font-bold text-[13px]  hidden sm:block'>Image</p>
              <input className='hidden' type="file" name="file3" id="file3" onChange={onImageChange} />
            </Button> :
              <div className='flex'>

                {/* {upload && <Button disabled={uploadButton} onClick={handleUpload} size='large' color='success' startIcon={<CloudUploadIcon />}>
                  <p className='font-bold text-[13px]  hidden sm:block'>Upload</p>
                </Button>} */}

                {!queryPost.isPending && <Button onClick={handleDelete} size='large' color='error' startIcon={<DeleteForeverIcon />}>
                  <p className='font-bold text-[13px]  hidden sm:block'>Delete</p>
                </Button>}
              </div>
            }

            <Button size='large' color='primary' startIcon={<LocalOfferIcon />}>
              <p className='font-bold text-[13px]  hidden sm:block'>Tag</p>
            </Button>

            <Button size='large' color='secondary' startIcon={<PlaceIcon />}>
              <p className='font-bold text-[13px]  hidden sm:block'>Location</p>
            </Button>

            <Button onClick={handleOpenPop} size='large' color='warning' startIcon={<EmojiEmotionsIcon />}>
              <p className='font-bold text-[13px]  hidden sm:block'>Feeling</p>

              <Popover
                id={id}
                open={openPop}
                anchorEl={anchorEl}
                onClose={handleClosePop}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
              >

                <EmojiPicker onEmojiClick={handleEmoji} />

              </Popover>

            </Button>


          </div>


          <div className='p-2'>
            
            <LoadingButton
              loading = {queryPost.isPending}
              onClick={handlePost}
              loadingPosition="start"
              startIcon={<SendIcon />}
              variant="outlined"
              
            >
              {queryPost.isPending ? "wait" : "post"}
            </LoadingButton>
          </div>

        </div>

      </Paper>

      {/* Snakbar after successfull completion */}
      <Snackbar open={openAlertSuccess} autoHideDuration={6000} onClose={handleCloseSuccess} TransitionComponent={TransitionUp}>
        <Alert onClose={handleCloseSuccess} severity='primary' sx={{ width: '100%', bgcolor: '#1976D2', color: "white" }}>
          A post has been created successfully 🥳🎉
        </Alert>
      </Snackbar>
    </div>
  )
}

export default Share
