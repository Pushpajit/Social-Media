import { Avatar, Box, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React, { useEffect, useState } from 'react'
import { PUBLIC_URL } from '../PUBLIC_URL';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteComment, getUser } from '../utils/api';


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
    const query = useMutation({
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

    // ********************** END *************************** //


    // handle delete comment
    const handleDelete = () => {
        handleClose();
        query.mutate({ postID: props.postID, commentID: props.commentID });
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
