import { Avatar, Button, Divider, Paper, Popover, TextField } from '@mui/material'
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PlaceIcon from '@mui/icons-material/Place';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SendIcon from '@mui/icons-material/Send';
import React, { useEffect, useState } from 'react'
import EmojiPicker from 'emoji-picker-react';

import { PUBLIC_URL } from '../PUBLIC_URL';

import ReactQuill from 'react-quill';
import MDEditor from '@uiw/react-md-editor';

import 'react-quill/dist/quill.snow.css';


async function uploadFile(image) {
  const endpoint = `${PUBLIC_URL}/upload`;

  let res = await fetch(endpoint, {
    method: "POST",

    body: image
  })


  if (res.ok) {
    res = await res.json();
    // console.log(res);
    alert("File uploaded!");
    return res;
  } else {
    alert("File not uploaded!");
    return false;
  }
}

async function createPost(desc, image) {

  const user = JSON.parse(localStorage.getItem("user"));
  const endpoint = `${PUBLIC_URL}/post/` + user._id;
  const payload = {
    username: user.username,
    userID: user._id,
    desc: desc,
    image: image || ""
  }

  // console.log("payload: ", payload);

  let res = await fetch(endpoint, {
    method: "POST",
    headers: {
      'Content-type': 'application/json'
    },

    body: JSON.stringify(payload)
  });



  if (res.ok) {
    res = await res.json();
    alert("successfully posted 😀");
    return true;
  }
  else {
    alert("post unsuccessfull, something went wrong 😐");
    return false;
  }

}


function Share(props) {
  const [image, setImage] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [upload, setUpload] = useState(false);
  const [filename, setFilename] = useState("");
  const [uploadButton, setuploadButton] = useState(false);
  const [user, setuser] = useState(null);
  // Rich text editor
  const [content, setContent] = useState("");
  // 




  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    if (!user)
      setuser(data);

  }, [user])


  // Trigger file selector.
  function openFileManager(e) {
    document.getElementById('file1').click();
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
  const handlePost = async () => {
    // Regular exp to check the content is not containing any whitesspaces/new line chars/empty strings
    if ((/^[\s\n]*$/.test(content)) && filename === "")
      return;

    await createPost(content, filename);
    setImage(null);
    setUpload(false);
    setContent("");
    props.setData([]);

  }
  // 

  // Ulpoad a file
  const handleUpload = async (e) => {

    alert("Hang tight, your file is uploading to the server 🥱")
    setuploadButton(true);
    const res = await uploadFile(image?.file);
    // console.log(res);

    if (res) {
      setUpload(false);
      setuploadButton(false);
      setFilename(res?.downloadURL);
    }

  }
  // 


  // Delete a file
  const handleDelete = async () => {
    setUpload(false);
    setImage(null);
  }
  // 

  // Setting the EDMarkdown editor theme light
  document.documentElement.setAttribute('data-color-mode', 'light');

  // Testing the content
  // console.log(content);

  return (
    <div>
      <Paper elevation={2} sx={{ width: { xs: "100%", sm: "100%" }, marginBottom: 5 }}>
        {/* Top section */}
        <div className='flex gap-2 '>
          {/* <Avatar src={user?.profilePicture || ProfilePic} sx={{ cursor: "pointer" }}></Avatar> */}
          {/* Text Editor */}
          {/* <TextField onChange={(e) => {console.log(e.target.value); setCaption(e.target.value)}} value={caption} size='small' sx={{ width: { xs: "100%" }, textTransform: "none" }} inputProps={{autoCorrect: 'off'}} fullWidth multiline placeholder='Share a post'></TextField> */}
          <div className='w-full'>
            {/* <ReactQuill
        
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              placeholder="What's on your mind?"
              
            >
            </ReactQuill> */}
            <MDEditor
              value={content}
              onChange={setContent}
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
              <p className='font-bold text-[13px] text-black hidden sm:block'>Image</p>
              <input className='hidden' type="file" name="file1" id="file1" onChange={onImageChange} />
            </Button> :
              <div className='flex'>

                {upload && <Button disabled={uploadButton} onClick={handleUpload} size='large' color='success' startIcon={<CloudUploadIcon />}>
                  <p className='font-bold text-[13px] text-black hidden sm:block'>Upload</p>
                </Button>}

                <Button onClick={handleDelete} size='large' color='error' startIcon={<DeleteForeverIcon />}>
                  <p className='font-bold text-[13px] text-black hidden sm:block'>Delete</p>
                </Button>
              </div>
            }

            <Button size='large' color='primary' startIcon={<LocalOfferIcon />}>
              <p className='font-bold text-[13px] text-black hidden sm:block'>Tag</p>
            </Button>

            <Button size='large' color='secondary' startIcon={<PlaceIcon />}>
              <p className='font-bold text-[13px] text-black hidden sm:block'>Location</p>
            </Button>

            <Button onClick={handleOpenPop} size='large' color='warning' startIcon={<EmojiEmotionsIcon />}>
              <p className='font-bold text-[13px] text-black hidden sm:block'>Feeling</p>

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
            <Button disabled={upload ? true : false} onClick={handlePost} size='medium' variant='contained' startIcon={<SendIcon />}>
              <p className='font-bold text-[13px] text-white'>Post</p>
            </Button>
          </div>

        </div>

      </Paper>
    </div>
  )
}

export default Share
