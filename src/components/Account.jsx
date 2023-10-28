import { Box, Button, FormControlLabel, Modal, Radio, RadioGroup, TextField } from '@mui/material';
import ProfilePic from '../assets/avatar-1577909_1280.webp'
import React, { useState } from 'react'

import { PUBLIC_URL } from '../PUBLIC_URL';

async function uploadFile(image) {
    const endpoint = `${PUBLIC_URL}/upload`;

    let res = await fetch(endpoint, {
        method: "POST",
        body: image
    })

    // console.log(res);

    if(res.status === 500){
        alert(res.statusText);
        return null;
    }

    res = await res.json();
    return res?.downloadURL;
       
}


// update a user
async function updateUser(userID, updateData) {

    const endpoint = `${PUBLIC_URL}/user/${userID}/`;


    const payload = {
      userID: userID,
      ...updateData
    }
  
    let res = await fetch(endpoint, {
      method: "PUT",
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  
    res = await res.json();
    // console.log(res);

    if(res?.user)
        localStorage.setItem("user", JSON.stringify(res?.user));
    // alert(res.status);

    return true;
  
  }
  



const style = {
    position: 'absolute',

    top: '45%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    boxShadow: 24,
    p: 2,

};

function Account(props) {

    const [updateData, setUpdateData] = useState({
        username: props.user?.username || "",
        profilePicture: props.user?.profilePicture || "",
        desc: props.user?.desc || "",
        relationship: props.user?.relationship || "",
        city: props.user?.city || "",
        from: props.user?.from || ""
    });

    // Image controll
    const [image, setImage] = useState(props?.user.relationship || '');


    // Handle changes
    const handleChange = (event) => {
        // console.log(`${event.target.name}: ${event.target.value}`);

        setUpdateData(prev => {
            return {
                ...prev,
                [event.target.name]: event.target.value
            }
        })
    }
    // 

    // Handle cancle
    const handleCancle = () => {
        setImage(null);
        props?.handleClose();
        setUpdateData({
            username: props.user?.username || "",
            profilePicture: props.user?.profilePicture || "",
            desc: props.user?.desc || "",
            relationship: props.user?.relationship || "",
            city: props.user?.city || "",
            from: props.user?.from || ""
        })
    }

    // 

    




    // Handle update
    const handleUpdate = async () => {
        // console.log(updateData);
        const result = await updateUser(props.user?._id, updateData);

        if(result){
            alert("Profile updated 😀");
            handleCancle();
            props.setUser(null);
        
        }else{
            alert("Profile not updated, something went wrong 😟");
            handleCancle();
        }
    }



    return (
        <div>
            <Modal
                open={props?.openModal}
                onClose={props?.handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} bgcolor={"background.default"} color={"text.primary"}>
                    <p className='text-center text-2xl font-bold mb-2'>Edit Your Info</p>

                    <div className='items-center content-center hover:cursor-pointer mb-2'>
                        <img className='mx-auto text-center h-[150px] w-[150px] object-cover border-[4px] border-blue-600' src={image?.bolb || updateData.profilePicture || ProfilePic} alt="profile-pic" style={{ borderRadius: "50%", }} />

                    </div>


                    <div className='space-y-3'>
                        <TextField onChange={handleChange} name='username' label="Username" variant="standard" sx={{ width: "100%" }} value={updateData.username} />
                        <TextField onChange={handleChange} name='desc' multiline maxRows={4} label="Description" value={updateData.desc} variant="standard" sx={{ width: "100%", }} />
                        <TextField onChange={handleChange} name='city' label="City" variant="standard" sx={{ width: "100%" }} value={updateData.city} />
                        <TextField onChange={handleChange} name='from' label="From" variant="standard" sx={{ width: "100%" }} value={updateData.from} />
                        <p className='text-base'>Relationship</p>

                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="relationship"
                            onChange={handleChange}
                            value={updateData.relationship}
                        >
                            <FormControlLabel value="Single" control={<Radio color='success' />} label="Single" />
                            <FormControlLabel value="Complex" control={<Radio color='secondary' />} label="Complex" />
                            <FormControlLabel value="Married" control={<Radio color='error' />} label="Married" />

                        </RadioGroup>

                        <div className='space-x-4 float-right'>
                            <Button onClick={handleCancle} variant='contained' size='small'>Cancle</Button>
                            <Button onClick={handleUpdate} variant='contained' size='small'>Update</Button>
                        </div>
                    </div>

                </Box>
            </Modal>
        </div>
    )
}

export default Account
