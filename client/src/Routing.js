import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginAndSignUp from './LoginAndSignUp';
import Chat from './Chat';
import UserContextProvider from './UserContextProvider';

function Routing() {

    return (
        <BrowserRouter>
            <UserContextProvider>
                <Routes>
                    <Route path='/' element={<LoginAndSignUp />} />
                    <Route path='/chat' element={<Chat />} />
                </Routes>
            </UserContextProvider>
        </BrowserRouter>
    )
}

export default Routing
