import React, { useState } from 'react'
import ProfileDialog from './ProfileDialog';

function DropDownMenu({openMenu, setOpenMenu, loggedUser, user, setSelectedChat}) {

    const [open, setOpen] = useState(false);
    const [view, setView] = useState('');

    const menuItem = [
        {id: 1, name: 'Contact Info'},
        {id: 2, name: 'Close Chat'},
    ]

    const viewProfile = (item) => {
        setView(item.name)
        setOpen(true)
    }

    return (
        //ring - in css border
        <div className='absolute right-9 z-10 mt-4 bg-slate-100 shadow-lg w-56 rounded-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
            <div className=''>
                {menuItem.map((item) => {
                    return (
                        <p className='p-2 cursor-pointer w-full hover:bg-white' onClick={() => {
                            viewProfile(item)
                        }}>{item.name}</p>
                    )
                })}

                {
                    (view === menuItem[0].name && open === true) ? <ProfileDialog open={open} setOpen={setOpen} loggedUser={loggedUser} user={user} /> : ''
                }

                {
                    (view === menuItem[1].name && open === true) ? setSelectedChat(null) : ''
                }

            </div>
        </div>
    )
}

export default DropDownMenu
