import { Box, Divider, FormControlLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Modal, Switch, Typography } from '@mui/material'
import BookmarkIcon from '@mui/icons-material/Bookmark';
import GroupsIcon from '@mui/icons-material/Groups';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import FavoriteIcon from '@mui/icons-material/Favorite';
import React from 'react'


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

function Sidebar() {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <Box position={"fixed"} sx={{ top: 67, left: 0, width: "40vh", display: { xs: "none", lg: "block" }, height: "calc(100vh - 64px)", backgroundColor: "white", paddingTop: 5 }}>

            <div className='flex flex-col justify-between h-full'>

                {/* Top */}
                <div>
                    <List >
                        <Divider />
                        <ListItem disablePadding>
                            <ListItemButton >
                                <ListItemIcon >
                                    <RssFeedIcon />
                                </ListItemIcon>
                                <ListItemText primary="Feed" />
                            </ListItemButton>
                        </ListItem>


                        <ListItem disablePadding>
                            <ListItemButton >
                                <ListItemIcon >
                                    <BookmarkIcon />
                                </ListItemIcon>
                                <ListItemText primary="Bookmark" />
                            </ListItemButton>
                        </ListItem>


                        <ListItem disablePadding>
                            <ListItemButton >
                                <ListItemIcon >
                                    <FavoriteIcon />
                                </ListItemIcon>
                                <ListItemText primary="Activity" />
                            </ListItemButton>
                        </ListItem>


                        <ListItem disablePadding>
                            <ListItemButton >
                                <ListItemIcon >
                                    <GroupsIcon />
                                </ListItemIcon>
                                <ListItemText primary="Group" />
                            </ListItemButton>
                        </ListItem>


                        <ListItem disablePadding sx={{ marginBottom: 5 }}>
                            <ListItemButton >
                                <ListItemIcon >
                                    <PeopleIcon />
                                </ListItemIcon>
                                <ListItemText primary="People" />
                            </ListItemButton>
                        </ListItem>


                        <Divider />
                        <ListItem disablePadding >
                            <ListItemButton>

                                <FormControlLabel control={<Switch sx={{ marginRight: 1 }} />} label="Light" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </div>

                {/* Bottom */}
                <div>
                    <List>
                        <Divider />
                        <ListItem disablePadding>
                            <ListItemButton >
                                <ListItemIcon >
                                    <SettingsIcon />
                                </ListItemIcon>
                                <ListItemText primary="Settings" />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton onClick={handleOpen}>
                                <ListItemIcon >
                                    <InfoIcon />
                                </ListItemIcon>
                                <ListItemText primary="About" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </div>
            </div>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                    Welcome to Connect! 🌐
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2, textAlign: "justify" }}>
                    Discover, engage, and connect with like-minded individuals worldwide.
                    Unleash the power of networking as you share your interests, ideas, and experiences.
                    Embrace meaningful conversations, build lasting relationships, and explore endless opportunities together. 
                    Your online community awaits - let's Connect! 🤝😊 
                    </Typography>

                    <p className='text-slate-600 text-xs font-semiboldbold text-right'>Created by Pushpajit Biswas</p>
                </Box>
            </Modal>
        </Box>
    )
}

export default Sidebar
