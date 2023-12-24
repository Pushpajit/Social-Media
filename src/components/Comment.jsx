import { Avatar, Box, IconButton, InputBase, Menu, MenuItem, Typography } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react'
import { PUBLIC_URL } from '../PUBLIC_URL';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteComment, editComment, getUser } from '../utils/api';


// Get the timestamp of the post (replace this with your actual timestamp)
function timeAgo(postTimestamp) {
    const now = new Date();
    const postDate = new Date(postTimestamp);

    const timeDifference = now - postDate;
    const secondsDifference = Math.floor(timeDifference / 1000);
    const minutesDifference = Math.floor(secondsDifference / 60);
    const hoursDifference = Math.floor(minutesDifference / 60);
    const daysDifference = Math.floor(hoursDifference / 24);
    const weeksDifference = Math.floor(daysDifference / 7);
    const monthsDifference = Math.floor(now.getMonth() - postDate.getMonth() + (12 * (now.getFullYear() - postDate.getFullYear())));
    const yearsDifference = Math.floor(monthsDifference / 12);

    if (secondsDifference < 60) {
        return `${secondsDifference} second${secondsDifference === 1 ? '' : 's'} ago`;
    } else if (minutesDifference < 60) {
        return `${minutesDifference} minute${minutesDifference === 1 ? '' : 's'} ago`;
    } else if (hoursDifference < 24) {
        return `${hoursDifference} hour${hoursDifference === 1 ? '' : 's'} ago`;
    } else if (daysDifference < 7) {
        return `${daysDifference} day${daysDifference === 1 ? '' : 's'} ago`;
    } else if (weeksDifference < 4) {
        return `${weeksDifference} week${weeksDifference === 1 ? '' : 's'} ago`;
    } else if (monthsDifference < 12) {
        return `${monthsDifference} month${monthsDifference === 1 ? '' : 's'} ago`;
    } else {
        return `${yearsDifference} year${yearsDifference === 1 ? '' : 's'} ago`;
    }
}




function Comment(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [edittext, setEdittext] = useState(props?.text);
    const [openEdit, setOpenEdit] = useState(false);

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // console.log(props.userID);

    // ********************** Query Hooks ************************** //

    const queryClient = useQueryClient();
    const queryUser = useQuery({
        queryKey: [`user`, props.userID],
        queryFn: async () => {
            return await getUser({ ID: props.userID });
        }
    })
    const queryDelete = useMutation({
        mutationFn: deleteComment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allPost'] });
            queryClient.invalidateQueries({ queryKey: ['userpost'] });
        },
        onError: (err) => {
            console.log("[COMMENT]: ", err);
            alert("[COMMENT]: NOT DELETED 😢");
        }
    })

    const queryEdit = useMutation({
        mutationFn: editComment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allPost'] });
            queryClient.invalidateQueries({ queryKey: ['userpost'] });
            
        },
        onError: (err) => {
            console.log("[COMMENT]: ", err);
            alert("[COMMENT]: NOT EDITED 😢");
        }
    })

    // ********************** END *************************** //


    // handle delete comment
    const handleDelete = () => {
        handleClose();
        queryDelete.mutate({ postID: props.postID, commentID: props.commentID });
    }

    // handle edit comment
    const handleEditChange = (e) => {
        setEdittext(e.target.value);
    }

    // handle the edit request
    const handleEdit = (e) => {
        setOpenEdit(false);
        queryEdit.mutate({ postID: props.postID, commentID: props.commentID, text: edittext });
    }

    return (
        <Box sx={{ marginBottom: 3 }}>
            <Box sx={{ display: 'flex', alignItems: "center", gap: 3, justifyContent: "space-between" }}>
                <div className='flex items-center gap-5'>
                    <Avatar src={queryUser.isSuccess && queryUser.data.data?.profilePicture}>
                    </Avatar>

                    <div className='flex space-x-2'>
                        <Typography>{props?.username}</Typography>
                        <Typography variant='caption' color="text.secondary">{timeAgo(props.commentTime)}</Typography>
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
                    {JSON.parse(localStorage.getItem("user"))._id === props.userID && <MenuItem onClick={(e) => { setOpenEdit(true); handleClose(); }} >Edit</MenuItem>}
                    {JSON.parse(localStorage.getItem("user"))._id === props.userID && <MenuItem onClick={handleDelete} >Delete</MenuItem>}
                    <MenuItem onClick={handleClose}>Report</MenuItem>
                </Menu>
            </Box>

            <div className={`${!openEdit ? 'block' : 'hidden'}`}>
                <Typography variant="body2" color="text.primary" sx={{ paddingLeft: 8, paddingRight: 2 }}>
                    {props?.text}
                </Typography>
            </div>


            {/* Custom inline edit field */}
            <div className={`${openEdit ? 'flex' : 'hidden'} gap-2`}>
                <InputBase
                    value={edittext}
                    onChange={handleEditChange}
                    sx={{
                        border: "1px dashed",
                        borderRadius: 2, marginLeft: 6, paddingRight: 2, paddingLeft: 2,

                    }}

                >
                </InputBase>

                <div>
                    <IconButton onClick= { handleEdit }  size='small' color='success' >
                        <CheckIcon />
                    </IconButton>

                    <IconButton onClick={(e) => { setOpenEdit(false); setEdittext(props.text) }} size='small' color='error' >
                        <CloseIcon />
                    </IconButton>
                </div>
            </div>
        </Box>
    )
}

export default Comment
