import React, { useContext, useState } from 'react';
import axios from 'axios';
import { UserContext } from './UserContextProvider';
import { Button, Alert, TextField, Dialog, DialogContent, DialogContentText, CircularProgress } from '@mui/material';

function SlideDrawer({ open, setOpen }) {

    const [search, setSearch] = useState('');
    const [searchLen, setSearchLen] = useState('');
    const { user , setSelectUser , chats, setChats } = useContext(UserContext);
    const [searchUsers, setSearchUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { setSelectedChat } = useContext(UserContext);


    const handleClose = () => {
        setOpen(false);
        setSearch('');
        setSearchLen('');
        setSearchUsers([]);
    };

    const handleKeyPress = async (event) => {
        if (event.key === "Enter" && searchLen === '') {
            event.preventDefault();
            handleSearch();
        }
        if (event.key === "Enter" && search) {
            event.preventDefault();
            handleSearch();
        }
    }

    const handleSearch = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${user ? user.token : ''}`
            }
        }

        setLoading(true);
        if (!search) {
            setSearchLen('Please enter username or email...')
            setLoading(false)
            setSearchUsers([])
        } else {
            setSearchLen('')
            try {
                await axios.get(`http://localhost:4000/api/user?search=${search}`, config)
                    .then((res) => {

                        setLoading(false);
                        if(res.data.length == 0) {
                            setSearchLen('User not exists...')
                            setSearchUsers([])
                            return;
                        }
                        setSearchUsers(res.data);                    
                    }).catch(err => {
                        console.log(err.response.data)
                    })
            } catch (error) {
                console.log(error)
            }
        }
    }

    const accessChat = async (userId) => {
        try{
            const config = {
                headers: {
                    "Content-type": "Application/json",
                    Authorization: `Bearer ${user ? user.token : ''}`
                }
            }
            
            const { data } = await axios.post('http://localhost:4000/api/chat', {userId}, config)

            console.log(chats)
            if(!chats.find((c) => c.id !== data._id)){ 
                setChats([data, ...chats]);
            }
            setSelectUser(data);
            setSelectedChat(data)
            handleClose();
            setSearch('');
            setSearchUsers([])
        }
        catch(error) {
            console.log(error);
        }
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth={'lg'} >
            <DialogContent>
                <DialogContentText>Search a user to chat with them.</DialogContentText>
                <div className='flex m-2'>
                    <TextField
                        margin="dense"
                        id="name"
                        placeholder="Search User"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />
                    <div className='ml-4 mt-2'>
                        <Button
                            variant="contained"
                            className='flex-grow h-10'
                            onClick={handleSearch}>
                            Go</Button>
                    </div>
                </div>

                <div className='font-gray'>
                    {
                        searchLen && (
                            <Alert severity="error" sx={{ width: '100%' }}>
                                {searchLen}
                            </Alert>
                        )
                    }
                    {
                        loading && (
                            <div className='text-center mt-2'>
                                <CircularProgress />
                            </div>
                        )
                    }
                    {
                        searchUsers.map((person) => {
                            return (
                                <div className=' flex p-2 m-3 cursor-pointer hover:bg-blue-100' key={person._id} onClick={() => accessChat(person._id)}>
                                    <img src={person.pic} className='h-14 w-14 rounded-full object-cover' alt="" />
                                    <div className='flex flex-col ml-5 mr-5'>
                                        <span className='text-lg font-bold'>{person.username}</span>
                                        <span className=''>{person.email}</span>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default SlideDrawer
