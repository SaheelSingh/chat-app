import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext();

function UserContextProvider({children}) {

    const [user, setUser] = useState();
    const [selectUser, setSelectUser] = useState();
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);

        if(!user) navigate('/');
    }, [navigate])

    return (
        <UserContext.Provider value={{ user , setUser , selectUser , setSelectUser , chats , setChats , selectedChat, setSelectedChat }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider
