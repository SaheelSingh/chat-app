import { Avatar, Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React from 'react'

function ProfileDialog({ open, setOpen, user }) {

    const handleClose = () => {
        setOpen(false)
    }

    console.log(user)

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            className='text-center rounded-lg'
        >
            <div className='p-6'>
                <Avatar src={user.pic} sx={{ width: 350, height: 350 }} />
            </div>
            <DialogContent>
                <DialogTitle id="alert-dialog-title">
                    Email: {user.email}
                </DialogTitle>
                <DialogContentText id="alert-dialog-description">
                    Username: {user.username}
                </DialogContentText>
            </DialogContent>
        </Dialog>
    )
}

export default ProfileDialog
