import { Box } from '@mui/material'
import { PUBLIC_URL } from '../PUBLIC_URL';
import Post from './Post';

import Share from './Share';
import { useEffect, useState } from 'react';


async function getAllPosts(){
  
  const endpoint = `${PUBLIC_URL}/post/`;

  let res = await fetch(endpoint, {
    method: "GET",
    headers: {
      'Content-type': 'application/json'
    }
  });

  res = await res.json();
  return res;
}


function Feed(props) {

  const [data, setData] = useState([]);
  

  // console.log(data);
  
  useEffect(() => {
    console.count("Render Count");
    
    if(data.length === 0){
      getAllPosts()
      .then(data => setData(data.reverse()))
      .catch(err => alert(err));
    }

    // console.log("api called!");

  }, [data])

  return (
    <Box sx={{ flex: { lg: 6, sm: 10, md: 10 }, flexGrow: { xs: 1 }, marginLeft: { lg: "40vh" }, height: "calc(100vh - 64px)", p: { lg: 5, xs: 0, sm: 3 }, paddingRight: { xs: 2 }, paddingLeft: { xs: 2 }, paddingTop: { xs: 2 }, placeItems: "center" }}>
      {/* Share a post */}
      <Share setData={setData}/>

      {/* Post Card */}
      {data.map((item, ind) => {
        if(ind !== data.length - 1)
          return <Post key={ind} data={item}  setData={setData}/>
      })}
    </Box>
  )
}

export default Feed
