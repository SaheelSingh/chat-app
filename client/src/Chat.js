import React, { useContext, useEffect, useRef, useState } from 'react';
import selectUser from './photo/selectUser.png'
import { TextField, IconButton, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import GroupsIcon from '@mui/icons-material/Groups';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SlideDrawer from './SlideDrawer';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContextProvider';
import axios from 'axios';
import { getFullSenderInfo, getPic, getSender } from './config/chatLogics';
import DropDownMenu from './components/DropDownMenu';
import moment from 'moment';
const { io } = require("socket.io-client");

const ENDPOINT = 'http://localhost:4000';
var socket, selectedChatCompare;

function Chat() {
    const [open, setOpen] = useState(false);
    const [loggedUser, setLoggedUser] = useState();
    const navigate = useNavigate();
    const { user, chats, setChats, selectedChat, setSelectedChat } = useContext(UserContext);
    const [openMenu, setOpenMenu] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socketConnected, setSocketConnected] = useState(false);
    const divUnderMessage = useRef();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        navigate('/');
    }

    const fetchUsers = async () => {
        try {
            if (user) {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }

                await axios.get('http://localhost:4000/api/chat', config)
                    .then((res) => {
                        setChats(res.data)
                    }).catch((err) => {
                        console.log(err)
                    })
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connection", () => setSocketConnected(true));
    })

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
        fetchUsers();

        selectedChatCompare = selectedChat;
    }, [selectedChat])

    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            console.log('recieved');
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                return
            } else {
                setMessages([...messages, newMessageRecieved])
            }
        }).on('sync_message', (response) => {
            socket.emit("new message", response)
            console.log(response)
            setMessages([...messages, response])
        })
    })

    const handleKeyPress = async (event) => {
        if (event.key === "Enter" && newMessage) {
            event.preventDefault();
            sendMessage();
        }
    }

    const sendMessage = async (event, file) => {
        try {
            if (user) {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }

                if (file) {
                    socket.emit("upload file", { file: file, content: newMessage, chatId: selectedChat._id, sender: loggedUser._id })
                } else {
                    await axios.post(`http://localhost:4000/api/message`, { content: newMessage, file: "", chatId: selectedChat._id }, config)
                        .then(res => {
                            console.log(res.data)
                            socket.emit("new message", res.data)
                            setMessages([...messages, res.data])
                            setNewMessage('')
                        }).catch(err => console.log(err))
                }

            }

        } catch (error) {
            console.log(error)
        }
    }

    const handleUploadFile = (ev) => {
        const reader = new FileReader();
        reader.readAsDataURL(ev.target.files[0]);
        reader.onload = () => {
            sendMessage(null, {
                name: ev.target.files[0].name,
                data: reader.result,
            });
        };
    }

    const fetchMessages = async () => {
        try {
            if (user) {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
                await axios.get(`http://localhost:4000/api/message/${selectedChat._id}`, config)
                    .then(res => {
                        console.log(res.data)
                        setMessages(res.data)
                        socket.emit("join chat", selectedChat._id);
                    });
                return;
            }
            else {
                console.log("Loading....")
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchMessages();
    }, [selectedChat])

    useEffect(() => {
        //auto scrolling
        const div = divUnderMessage.current;
        if (div) {
            div.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }
    }, [messages])

    return (
        <>
            <div className='flex h-screen'>
                <div className='flex flex-col w-1/3 p-3 bg-slate-50 '>
                    <div className='flex-grow'>
                        <div className='text-blue-600 flex font-bold gap-2 m-auto'>
                            <img className='h-12 w-12 rounded-full ml-4 object-cover ' src={user ? user.pic : ''} alt="profile_pic" /><span className='text-black text-lg ml-2 mt-2'>{user ? user.username : ''}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9 ml-auto">
                                <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
                                <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
                            </svg>
                            <span className='text-lg m-1'>FastChat</span>
                            <hr />
                        </div>
                        <div className='flex p-2'>
                            <Button variant='outlined' size='large' className='w-5/6 ' startIcon={<SearchIcon />} onClick={handleClickOpen} >Search</Button>

                            <IconButton className='w-1/6' aria-label="delete" size="large">
                                <GroupsIcon fontSize="inherit" />
                            </IconButton>
                        </div>

                        {chats &&
                            chats.map((person) => {
                                if (person) {
                                    return (
                                        <div
                                            onClick={() => setSelectedChat(person)}
                                            className={"flex p-2 m-3 bg-white cursor-pointer rounded-sm " + (selectedChat && selectedChat._id === person._id ? "bg-sky-100 " : "")}
                                            key={person.id}>
                                            {
                                                person.users && (
                                                    <>
                                                        <img src={getPic(loggedUser, person.users)} className='h-14 w-14 rounded-full' alt="reciver_pic" />
                                                        <div className='flex flex-col ml-5'>
                                                            <span className='text-lg font-bold'>{!chats.isGroupChat ? getSender(loggedUser, person.users) : chats.chatname}</span>
                                                            {person.latestMessage && (
                                                                <span className=''>
                                                                    {person.latestMessage.content.length > 45
                                                                        ? person.latestMessage.content.substring(0, 46) + "..."
                                                                        : person.latestMessage.content}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </>
                                                )
                                            }
                                        </div>
                                    )
                                } else {
                                    return;
                                }
                            })
                        }
                    </div>
                    <div className='p-3 text-center flex justify-center items-center'>
                        <span className='mr-2 text-gray-600 flex items-center'>
                            <PersonIcon /> {user ? user.username : ''}</span>
                        <button className='bg-blue-200 text-sm text-gray-500 p-2 rounded-sm' onClick={handleLogout}>Logout</button>
                    </div>
                </div>

                {
                    !selectedChat && (
                        <div className='flex-grow'>
                            <div className='flex h-screen flex-col justify-center items-center'>
                                <img src={selectUser} className='h-96'></img>
                                <span className='text-lg text-blue-600 text-shadow-2xl'>Select a user to chat with!</span>
                            </div>
                        </div>
                    )
                }

                {
                    selectedChat && (
                        <div className='flex flex-col w-2/3 bg-slate-150 md:w-4/6'>
                            <div className='flex-grow'>
                                <div className='bg-slate-100 h-16 flex'>
                                    <img src={getPic(loggedUser, selectedChat.users)} className='h-12 w-12 rounded-full m-2' alt='selectedUser' />
                                    <span className='text-3xl m-2'>{getSender(loggedUser, selectedChat.users)}</span>
                                    <div className='ml-auto m-4'>
                                        <Button onClick={() => setOpenMenu((prev) => !prev)} className='absolute rounded-full'>
                                            <MoreVertIcon className='cursor-pointer' />
                                        </Button>
                                        {
                                            openMenu && (
                                                <DropDownMenu openMenu={openMenu} setOpenMenu={setOpenMenu} loggedUser={loggedUser} user={getFullSenderInfo(loggedUser, selectedChat.users)} setSelectedChat={setSelectedChat} />
                                            )
                                        }
                                    </div>
                                </div>
                                <div className='relative h-full'>
                                    <div className=' overflow-y-scroll absolute top-2 left-0 right-0 bottom-12'>
                                        {
                                            messages.map((message) => {
                                                return (
                                                    <div className={message.sender._id === loggedUser._id ? 'text-right mr-2' : 'text-left ml-2'}>
                                                        <div className={'inline-block text-left p-2 my-1 rounded-md ' + (message.sender._id === loggedUser._id ? 'bg-blue-100 ml-36' : 'bg-gray-100 mr-36 ')}>
                                                            {message.file && (
                                                                <div className='flex'> 
                                                                {
                                                                    message.file.endsWith('.png') && (
                                                                        <a target='_blank' href={`http://localhost:4000/images/` + message.file}>
                                                                            <img src={`http://localhost:4000/images/` + message.file} className='w-96 h-96 object-cover' />
                                                                         </a>
                                                                    )
                                                                }
                                                                {
                                                                    message.file.endsWith('.jpeg') && (
                                                                        <a target='_blank' href={`http://localhost:4000/images/` + message.file}>
                                                                            <img src={`http://localhost:4000/images/` + message.file} className='w-96 h-96 object-cover' />
                                                                         </a>
                                                                    )
                                                                }
                                                                {
                                                                    message.file.endsWith('.docx') && (
                                                                        <a className='inline underline font-bold' target='_blank' href={`http://localhost:4000/images/` + message.file}>{message.file}</a>
                                                                    )
                                                                }
                                                                {
                                                                    message.file.endsWith('.pdf') && (
                                                                        <a className='inline underline font-bold' target='_blank' href={`http://localhost:4000/images/` + message.file}>{message.file}</a>
                                                                    )
                                                                }
                                                                    
                                                                </div>
                                                            )}
                                                            <span className='flex-1'>{message.content}</span>
                                                            <span className='flex-none ml-2 flex-row-reverse bottom-0 text-sm'>{moment(message.createdAt).format('LTS')}</span>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                        <div ref={divUnderMessage} />
                                    </div>
                                </div>
                            </div>
                            <form className='flex gap-2 m-2 z-10'>
                                <TextField
                                    className='w-5/6 bg-white flex-grow'
                                    placeholder='Type something...'
                                    color="primary"
                                    size='small'
                                    margin="normal"
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    value={newMessage}
                                    onKeyDown={handleKeyPress}
                                />

                                <label className='flex justify-center items-center cursor-pointer mt-4 bg-blue-200 p-2 h-10 rounded-md ' >
                                    <input type='file' className='hidden' onChange={handleUploadFile} />
                                    <AttachFileIcon />
                                </label>

                                <div className={'mt-4 ' + (newMessage === '' ? 'hidden' : '')}>
                                    <Button variant="contained" endIcon={<SendIcon />} className='h-10' onClick={sendMessage}>
                                        Send
                                    </Button>
                                </div>

                            </form>
                        </div>
                    )
                }

            </div>

            <SlideDrawer open={open} setOpen={setOpen} />
        </>

    )
}

export default Chat
