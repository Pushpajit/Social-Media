import React, { useEffect, useState } from 'react'
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Avatar, Box, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Tooltip, Typography } from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';


import { PUBLIC_URL } from '../PUBLIC_URL';
import { useNavigate } from 'react-router-dom';

// ALl friends of the user
async function getAllFriends(ID) {
    const endpoint = `${PUBLIC_URL}/user/${ID}/friends`;
    // console.log(ID);
    let res = await fetch(endpoint, {
        method: "GET",
        headers: {
            'Content-type': 'application/json'
        }
    });

    res = await res.json();

    // console.log("user friends: " + res);

    return res;

}


function UserTab(props) {
    const [value, setValue] = useState('1');
    const [friends, setFriends] = useState([]);
    const navigate = useNavigate();

    // console.log(props.friends);

    

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // console.log(props.friends)

     //Handle profile view
     const handleProfileView = (userID) => {
        navigate(`/profile/${userID}`);
    }
    //


    return (
        <div>
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList variant="fullWidth" onChange={handleChange} aria-label="lab API tabs example">

                            <Tab icon={<FavoriteIcon />} label="Followers" value="1" />
                            <Tab icon={<PeopleAltIcon />} label="Following" value="2" />

                        </TabList>
                    </Box>

                    {/* For Followers */}
                    <TabPanel value="1" sx={{ p: 0, width: "full" }}>
                        {props.friends?.followers.map((item, ind) => {
                            console.log(item[0]);
                            return <List key={item._id} sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                <ListItem alignItems="flex-start"
                                    disablePadding
                                    disableGutters
                                    secondaryAction={
                                        <Tooltip title="View Profile" placement='left'>
                                            <IconButton onClick={(e) => handleProfileView(item[0]._id)} edge="start" aria-label="comments" >
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>
                                    }
                                >

                                    <ListItemButton >

                                        <ListItemAvatar>
                                            <Avatar alt="Remy Sharp" src={item[0]?.profilePicture} />
                                        </ListItemAvatar>


                                        <ListItemText primary={item[0]?.username} />
                                    </ListItemButton>


                                </ListItem>

                            </List>

                        })}
                    </TabPanel>

                    {/* Followings list */}
                    <TabPanel value="2" sx={{ p: 0, width: "full" }}>
                        {props.friends?.followers && props.friends?.followigns.length !== 0 && props.friends?.followigns[0]?.map((item, ind) => {

                            return <List key={item._id} sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                <ListItem alignItems="flex-start"
                                    disablePadding
                                    disableGutters
                                    secondaryAction={
                                        <Tooltip title="View Profile" placement='left'>
                                            <IconButton onClick={(e) => handleProfileView(item._id)} edge="start" aria-label="comments">
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>
                                    }
                                >

                                    <ListItemButton >

                                        <ListItemAvatar>
                                            <Avatar alt="Remy Sharp" src={item?.profilePicture} />
                                        </ListItemAvatar>


                                        <ListItemText primary={item?.username} />
                                    </ListItemButton>


                                </ListItem>

                            </List>

                        })}
                    </TabPanel>

                </TabContext>
            </Box>
        </div>
    )
}

export default UserTab
