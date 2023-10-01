import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Feed from '../components/Feed'
import Rightbar from '../components/Rightbar'
import { Box } from '@mui/material'
import SideDrawer from '../components/SideDrawer'
import { useNavigate } from 'react-router-dom'

function Home({user}) {
  

    const [open, setOpen] = useState(false);

    const toggleDrawer = (open) => (event) => {
        if (
          event &&
          event.type === 'keydown' &&
          (event.key === 'Tab' || event.key === 'Shift')
        ) {
          return;
        }
    
        setOpen(open);
      };
    

  return (
    <>
      <Navbar toggleDrawer={toggleDrawer}/>

      {/* Main */}
      <Box sx={{marginTop: 8, display: "flex"}}>
        <Sidebar/>
        <SideDrawer open={open} toggleDrawer={toggleDrawer}/>
        
        <Feed />
        <Rightbar />

        <div  className='mb-[80%]'>

        </div>
      </Box>
    </>
  )
}

export default Home
