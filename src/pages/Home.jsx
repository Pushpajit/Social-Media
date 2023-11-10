import React, { Suspense, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Feed from '../components/Feed'
import Rightbar from '../components/Rightbar'
import { Box, createTheme } from '@mui/material'
import SideDrawer from '../components/SideDrawer'
import { useNavigate } from 'react-router-dom'

import { ThemeProvider } from '@emotion/react'

function Home({ user }) {


  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  // const theme = useTheme();

  // console.log(theme);
  useEffect(() => {
    setTheme(JSON.parse(localStorage.getItem("theme")));
  }, [theme])

  const darkTheme = createTheme({
    palette: {
      mode: theme
    }
  })

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
      <ThemeProvider theme={darkTheme}>
        <Navbar toggleDrawer={toggleDrawer} />

        {/* Main */}
        <Box sx={{ marginTop: 8, display: "flex" }} bgcolor={"background.default"} color={"text.primary"}>
          <Sidebar setTheme={setTheme} theme={theme}/>
          <SideDrawer open={open} toggleDrawer={toggleDrawer} />

          <Feed />
          <Rightbar />

        </Box>
      </ThemeProvider>
    </>
  )
}

export default Home
