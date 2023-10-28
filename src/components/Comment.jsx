import { Avatar, Box, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React, { useEffect, useState } from 'react'
import { PUBLIC_URL } from '../PUBLIC_URL';

async function deleteComment(commentID, postID) {
    const endpoint = `${PUBLIC_URL}/post/${postID}/comment`;

    const payload = {
        commentID: commentID
    }

    let res = await fetch(endpoint, {
        method: "DELETE",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(payload)
    })

    if(res.ok){
        alert("Comment Deleted Successfully!");
    }else{
        alert("Comment Delete Unsuccessfull :(");
        console.log(res);
    }
}

function Comment(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    // handle delete comment
    const handleDelete = async () => {
        await deleteComment(props.commentID, props.postID);
        props.refreshUser([]);
    }

    return (
        <Box sx={{ marginBottom: 3 }}>
            <Box sx={{ display: 'flex', alignItems: "center", gap: 3, justifyContent: "space-between" }}>
                <div className='flex items-center gap-5'>
                    <Avatar>
                    </Avatar>

                    <div className='flex space-x-2'>
                        <Typography>{props?.username}</Typography>
                        <Typography variant='caption' color="text.secondary">1 week ago</Typography>
                    </div>
                </div>

                <IconButton onClick={handleClick} size='small' sx={{ float: "right" }}>
                    <MoreVertIcon fontSize='small' />
                </IconButton>

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
                    {JSON.parse(localStorage.getItem("user"))._id === props.userID && <MenuItem >Edit</MenuItem>}
                    {JSON.parse(localStorage.getItem("user"))._id === props.userID && <MenuItem onClick={handleDelete} >Delete</MenuItem>}
                    <MenuItem onClick={handleClose}>Report</MenuItem>
                </Menu>
            </Box>


            <Typography variant="body2" color="text.primary" sx={{ paddingLeft: 8, paddingRight: 2 }}>
                {props?.text}
            </Typography>
        </Box>
    )
}

export default Comment
