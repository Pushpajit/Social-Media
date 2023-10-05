import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';

import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import ProfilePic from '../assets/avatar-1577909_1280.webp'

import { Box, Button, Checkbox, Divider, Menu, MenuItem, Modal, TextField } from '@mui/material';
import Comment from './Comment';
import { PUBLIC_URL } from '../PUBLIC_URL';
import { useNavigate } from 'react-router-dom';

import MDEditor from '@uiw/react-md-editor';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));


async function makeComment(text, id) {
  const user = JSON.parse(localStorage.getItem("user"));
  const endpoint = `${PUBLIC_URL}/post/${id}/comment`;
  const payload = {
    userID: user?._id,
    text: text,
    username: user?.username
  }

  const res = await fetch(endpoint, {
    method: "PUT",
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  // console.log(res);

  if (res.ok) {
    alert("commented successfully!");
  }
  else {
    alert("something went wrong!");
  }


}

async function likepost(postID){
  const user = JSON.parse(localStorage.getItem("user"));
  const endpoint = `${PUBLIC_URL}/post/${postID}/like`;
  const payload = {
    userID: user?._id,
  }

  let res = await fetch(endpoint, {
    method: "PUT",
    headers: {
      'Content-type': 'application/json'
    },

    body: JSON.stringify(payload)
  });

  if(res.ok){
    res = await res.json()
    // console.log(res.status);
  }
  else{
    alert(res.statusText);
  }
}


async function deletePost(postID) {
  const user = JSON.parse(localStorage.getItem("user"));
  const endpoint = `${PUBLIC_URL}/post/${user?._id}`;

  const payload = {
    userID: user?._id,
    postID: postID
  }

  // console.log(payload);

  let res = await fetch(endpoint, {
    method: "DELETE",
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (res.ok)
    alert("Post deleted!");
  else if(res.status === 403)
    alert("You cannot delete the post!");
  else
    alert(res.statusText);

  // console.log(res);

}


function postCreatedate(t){
  let date = new Date(t);
  let d = date.toDateString();
  d = [d.split(" ").slice(1,3).join(" "), d.split(" ").slice(3).join(" ")].join(", ")
  return d;
}


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
};


function Post(props) {

  const [expanded, setExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [value, setValue] = useState("");
  const [user, setUser] = useState(null);
  const [totalLikes, setTotalLikes] = useState(props.data?.like.length);
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();


  useEffect(()=>{
    const storage = JSON.parse(localStorage.getItem("user"));
    if(!user)
      setUser(storage);

    if(user){
      // console.log(props.data?.like);
      // console.log(user?._id);
      if(props.data?.like.includes(user?._id))
        setLiked(true);
    }
    
  }, [user])

  // Set default like for current user.
  
  
 
  // For delete confirm modal
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const handleOpenDeleteModal = () => setOpenDeleteModal(true);
  const handleCloseModal = () => setOpenDeleteModal(false);
  // 

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  //Make comment to the post. 
  const handleComment = async () => {
    // console.log(value);
    if (value === "")
      return;

    setValue("");
    await makeComment(value, props.data?._id);
  }

  // Handle like and dislike post
  const handleLikePost = async(e) => {
    // console.log(e.target.checked);
    if(e.target.checked){

      await likepost(props.data?._id);
      setTotalLikes(prev => prev + 1);
      setLiked(true);
    }
    else{

      await likepost(props.data?._id);
      setTotalLikes(prev => prev - 1);
      setLiked(false);
    }
  }
  // 


  // Delete The user post.
  const handleDeletePost = () => {
    handleClose();
    handleOpenDeleteModal();
  }

  const confirmDelete = async () => {
    handleCloseModal();
    await deletePost(props.data?._id);
    props.setData([]);
    
  }
  //

  //Handle profile view
  const handleProfileView = () => {
    handleClose();
    navigate(`/profile/${props.data?.userID}`);
  } 
  // 

  return (
    <Card sx={{ maxWidth: "100%", marginBottom: 10 }} bgcolor={"background.default"} color={"text.primary"}>
      <CardHeader 
        avatar={
          <IconButton onClick={handleProfileView}>
            <Avatar src={props.data?.profilePicture} sx={{ bgcolor: red[500], cursor: "pointer" }} aria-label="recipe">
            </Avatar>
          </IconButton>
        }
        action={
          <IconButton aria-label="settings" onClick={handleClick}>
            <MoreVertIcon />
          </IconButton>
        }
        title={props.data?.username}
        subheader={postCreatedate(props.data?.createdAt)}
      />

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {user?._id === props.data?.userID && <MenuItem onClick={handleClose}>Edit</MenuItem>}
        {user?._id === props.data?.userID && <MenuItem onClick={handleDeletePost}>Delete</MenuItem>}
        <MenuItem onClick={handleClose}>Report</MenuItem>
        <MenuItem onClick={handleProfileView}>Profile</MenuItem>
      </Menu>

      {props.data?.image !== "" && <CardMedia
        component="img"
        sx={{ width: "100%", height: 450, objectFit: "cover", p: 1 }}

        image={props.data?.image}
        alt="Image"
      />}

      {/* Card content */}
      <CardContent sx={{textTransform: "none", maxWidth: "100%", p: 1}}>
        
        {/* Markdown viewer */}
        <div className='w-full'>
          <MDEditor.Markdown  source={props.data?.desc} style={{ width: "100%", backgroundColor: "background.default"}} />
        </div>
        
      </CardContent>

      {/* Like/share/comment */}
      <CardActions disableSpacing>

        {/* Like Post */}
        <Checkbox checked={liked} onChange={handleLikePost} icon={<FavoriteBorder />} checkedIcon={<Favorite color="error" />} />
        {/*  */}

        <Typography variant='body2' color="text.secondary" sx={{ paddingRight: 2 }}>{totalLikes}</Typography>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <Typography variant='body2' color="text.secondary">{props.data.share || 0}</Typography>

        {/* Right comment button */}
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >

          <ExpandMoreIcon />
        </ExpandMore>
        <Typography variant='body2' color="text.secondary" >{props.data?.comment?.length || 0} {props.data?.comment?.length > 1 ? "Comments" : "Comment"}</Typography>
      </CardActions>

      {/* Collapse section */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        <CardContent >
          {/* Write comment */}
          <Box sx={{ display: 'flex', justifyContent: "space-between", alignContent: "center", gap: { xs: 2, md: 0 }, marginBottom: 5 }}>

            {/* Set dynamic profile pic*/}
            <Avatar src={user?.profilePicture || ProfilePic} sx={{ bgcolor: "crimson", cursor: "pointer" }}>

            </Avatar>

            <TextField value={value} onChange={(e) => setValue(e.target.value)} size='small' sx={{ width: { xs: "80%", md: "75%" } }} fullWidth multiline placeholder='Add a comment...'></TextField>

            <div>
              <Button onClick={handleComment} size='small' variant='contained'>
                Comment
              </Button>
            </div>
          </Box>

          {/* All comments */}
          <Box>
            {props.data?.comment.map((item, ind) => {
              return <Comment key={ind} username={item.username} text={item.text} />
            })}

          </Box>

        </CardContent>
      </Collapse>


      {/* Delete Confirmation Modal */}
      <Modal
        open={openDeleteModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure ?
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Selecting 'OK' will result in the permanent deletion of the post, while choosing 'Cancel' will abort the process.
          </Typography>

          <div className='float-right'>
            <Button onClick={handleCloseModal} size='small'>cancle</Button>
            <Button onClick={confirmDelete} size='small'>ok</Button>
          </div>
        </Box>
      </Modal>
    </Card>
  );
}

export default Post
