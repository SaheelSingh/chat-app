export const getSender = (loggedUser, users) => {
    if(loggedUser && users) {
        return users[0]._id === loggedUser._id ? users[1].username : users[0].username;
    }
}

export const getFullSenderInfo = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
}

export const getPic = (loggedUser, users) => {
    if(loggedUser && users) {
        return users[0]._id === loggedUser._id ? users[1].pic : users[0].pic;
    }
    else {
        return;
    }
}