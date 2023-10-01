import { Avatar, Box, IconButton, Typography } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React, { useEffect, useState } from 'react'

function Comment(props) {
    

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

                <IconButton size='small' sx={{ float: "right" }}>
                    <MoreVertIcon fontSize='small' />
                </IconButton>
            </Box>


            <Typography variant="body2" color="text.primary" sx={{ paddingLeft: 8, paddingRight: 2 }}>
                {props?.text}
            </Typography>
        </Box>
    )
}

export default Comment
