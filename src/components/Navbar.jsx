import { AppBar, Avatar, Badge, Box, IconButton, InputBase, Menu, MenuItem, Tooltip, Typography, useMediaQuery } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HubIcon from '@mui/icons-material/Hub';
import PersonIcon from '@mui/icons-material/Person';
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ProfilePic from '../assets/avatar-1577909_1280.webp'





function Appbar({ toggleDrawer }) {

  const theme = useTheme();
  const isMedium = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorElUser, setAnchorElUser] = useState(null); // For toggling menu.
  const [user, setuser] = useState(null);


  const navigate = useNavigate();


  // console.log(user);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    if (!user)
      setuser(data);
  }, [user])

  // Callback function for open and closing menu list.
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (e) => {
    setAnchorElUser(null);
  };


  const handleProfileNavigate = () => {
    navigate(`/profile/${user?._id}`);
    setAnchorElUser(null);
  }

  const handleHomeNavigate = () => {
    navigate('/');
    setAnchorElUser(null);
  }
  // 

  // Handle Logout
  const handleLogOut = () => {
    localStorage.removeItem("user");
    navigate('/signin');
    setAnchorElUser(null);
  }

  

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='fixed' sx={{ p: 1, flexDirection: 'row', gap: 1, alignItems: "center", justifyContent: "space-between" }}>

        {/* App icon and name */}
        <div className='flex items-center justify-center space-x-1'>
          <IconButton sx={{ color: "white", display: { xs: "block", sm: "none" } }} onClick={toggleDrawer(true)}>
            <HubIcon />
          </IconButton>
          <Typography variant='h6' component="div" sx={{ flexGrow: 1, fontWeight: 700, display: { xs: "none", sm: "block" } }} >
            Connect
          </Typography>
        </div>



        {/* search bar */}
        <Box className='border border-red flex  items-center justify-center space-x-2 pl-1 rounded-lg' bgcolor={"background.default"} color={"text.primary"} >
          <SearchIcon />
          <InputBase
            placeholder={isMedium ? 'Search' : 'Search for friend, post or video'}
            sx={{ width: { lg: 450, }, paddingRight: 2}}
          >
          </InputBase>
        </Box>


        {/* Router */}
        <div className='flex gap-2'>
          <Typography onClick={handleHomeNavigate} sx={{ display: { xs: "none", sm: "block" } }} variant='subtitle2' className='hover:cursor-pointer hover:text-slate-200'>
            Homepage
          </Typography>

          <Typography sx={{ display: { xs: "none", sm: "block" } }} variant='subtitle2' className='hover:cursor-pointer hover:text-slate-200'>
            Timeline
          </Typography>
        </div>

        {/* notification, frnd request icons */}
        <div className='flex gap-1'>

          <IconButton sx={{ color: "white" }}>
            <Badge badgeContent={1} max={99} color="error" className='hover:cursor-pointer hover:text-slate-200'>
              <PersonIcon />
            </Badge>
          </IconButton>



          <IconButton sx={{ color: "white" }}>
            <Badge badgeContent={1000} max={99} color="error" className='hover:cursor-pointer hover:text-slate-200'>
              <NotificationsIcon />
            </Badge>
          </IconButton>


        </div>

        {/* User avatar */}
        <Tooltip title={user?.username}>
          <IconButton onClick={handleOpenUserMenu}>
            <Avatar src={user?.profilePicture || ProfilePic} className='hover:cursor-pointer' sx={{ width: 35, height: 35 }} ></Avatar>
          </IconButton>
        </Tooltip>

        {/* Menu for profile settings menu */}
        <Menu
          sx={{ mt: '45px' }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >

          <MenuItem onClick={handleProfileNavigate}>Profile</MenuItem>
          <MenuItem onClick={handleCloseUserMenu}>Account</MenuItem>
          <MenuItem onClick={handleCloseUserMenu}>Dashboard</MenuItem>
          <MenuItem onClick={handleLogOut}>Logout</MenuItem>


        </Menu>

      </AppBar>

    </Box>
  )
}

export default Appbar
