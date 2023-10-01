import { Box, Button, FormControlLabel, FormLabel, Modal, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import ProfilePic from '../assets/Part_II_Ellie_infobox.webp'
import React from 'react'


const style = {
    position: 'absolute',
    // display: "flex",
    // direction: "row",
    // flexDirection: "column",
    top: '45%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 2,
    // alignItems: "center",

};

function Account(props) {

    return (
        <div>
            <Modal
                open={props.openModal}
                onClose={props.handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <p className='text-center text-slate-800 text-2xl font-bold mb-2'>Edit Your Info</p>

                    <div className='items-center content-center hover:cursor-pointer mb-2'>
                        <img className='mx-auto h-[150px] w-[150px] object-cover border-[4px] border-blue-600' src={ProfilePic} alt="profile-pic" style={{ borderRadius: "50%", }} />
                    </div>


                    <div className='space-y-3'>
                        <TextField label="Username" variant="standard" sx={{ width: "100%" }} value='Pushpajit Biswas' />
                        <TextField multiline maxRows={4} label="Description" variant="standard" sx={{ width: "100%", }} />
                        <TextField label="City" variant="standard" sx={{ width: "100%" }} value='Malda' />
                        <TextField label="From" variant="standard" sx={{ width: "100%" }} value='West Bengal' />
                        <p className='text-base text-gray-400'>Relationship</p>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                        >
                            <FormControlLabel value="female" control={<Radio color='success'/>} label="Single"  />
                            <FormControlLabel value="male" control={<Radio color='secondary'/>} label="Complex" />
                            <FormControlLabel value="other" control={<Radio color='error'/>} label="Married" />
                            
                        </RadioGroup>

                        <div className='space-x-4 float-right'>
                            <Button variant='contained' size='small'>Cancle</Button>
                            <Button variant='contained' size='small'>Save</Button>
                        </div>
                    </div>

                </Box>
            </Modal>
        </div>
    )
}

export default Account
