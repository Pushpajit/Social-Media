import {
    Box,
    Button,
    FormControlLabel,
    Modal,
    Radio,
    RadioGroup,
    Snackbar,
    TextField
} from '@mui/material';

import ProfilePic from '../assets/avatar-1577909_1280.webp'
import React, { useEffect, useState } from 'react'


import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '../utils/api';
import LoadingButton from '@mui/lab/LoadingButton';
import CloudSyncIcon from '@mui/icons-material/CloudSync';



import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


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


    

    // To fix the glitch whenever the userID is changed the Account should filled with that user's data only
    useEffect(() => {
        setUpdateData({
            username: props.user?.username || "",
            profilePicture: props.user?.profilePicture || "",
            desc: props.user?.desc || "",
            relationship: props.user?.relationship || "",
            city: props.user?.city || "",
            from: props.user?.from || ""
        })
    }, [props.user?._id])


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


    // ********************** Query Hooks ************************** //
    const queryClient = useQueryClient();
    const queryUpdate = useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            // alert("Profile updated 😀");
            handleClickSuccess();
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },

        onError: (err) => {
            alert("Profile not updated, something went wrong 😟");
            console.log("[UPDATE-ERROR]: ", err);
        }
    })
    // ********************** END ************************** //


    // Handle update
    const handleUpdate = () => {
        props?.handleClose();
        queryUpdate.mutate({ userID: props.user?._id, updateData: updateData });
    }


    // Handle Alert
    const [openAlertSuccess, setOpenAlertSuccess] = useState(false);
    const handleClickSuccess = () => {
        setOpenAlertSuccess(true);
    };

    const handleCloseSuccess = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlertSuccess(false);
    };
    //


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
                        <img className='mx-auto text-center h-[150px] w-[150px] object-cover border-[4px] border-blue-600' src={updateData.profilePicture || ProfilePic} alt="profile-pic" style={{ borderRadius: "50%", }} />

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
                            <Button disabled={queryUpdate.isPending} onClick={handleCancle} variant='outlined'>Cancle</Button>
                            {/* <Button onClick={handleUpdate} variant='contained' >Update</Button> */}
                            <LoadingButton
                                loading={queryUpdate.isPending}
                                onClick={handleUpdate}
                                loadingPosition="start"
                                startIcon={<CloudSyncIcon />}
                                variant="outlined"


                            >
                                {queryUpdate.isPending ? "updating" : "update"}
                            </LoadingButton>
                        </div>
                    </div>

                </Box>
            </Modal>

            <Snackbar open={openAlertSuccess} autoHideDuration={6000} onClose={handleCloseSuccess} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
                    Profile Updated Successfully 🎉
                </Alert>
            </Snackbar>

        </div>
    )
}

export default Account
