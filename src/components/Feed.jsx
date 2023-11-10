import { Box, CircularProgress } from '@mui/material'
import { PUBLIC_URL } from '../PUBLIC_URL';
import Post from './Post';

import Share from './Share';
import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';


import { getAllPosts } from '../utils/api';




function Feed(props) {

  const [data, setData] = useState([]);

  let Qdata = [];
   // Queries
  const query = useQuery({
    queryKey: ["allPost"],
    queryFn: getAllPosts,
    
  })


  if(query.isSuccess){
    Qdata = [...query.data.data].reverse();
    
  }

  // console.log(Qdata);

  return (
    <Box bgcolor={"background.default"} color={"text.primary"} sx={{ flex: { lg: 6, sm: 10, md: 10 }, flexGrow: { xs: 1 }, marginLeft: { lg: "40vh" }, height: "100%", p: { lg: 5, xs: 0, sm: 3 }, paddingRight: { xs: 2 }, paddingLeft: { xs: 2 }, paddingTop: { xs: 2 }, placeItems: "center" }}>
      {/* Share a post */}
      <Share setData={setData} />

      {/* Post Card */}

      {query.isLoading && <Box sx={{display: "flex", justifyContent: "center"}}>
        <CircularProgress />
      </Box>}

      <Box bgcolor={"background.default"} color={"text.primary"}>
        {Qdata.map((item, ind) => {
          if (ind !== Qdata.length - 1)
            return <Post key={ind} data={item} postID ={item._id}  />
        })}
      </Box>
    </Box>
  )
}

export default Feed
