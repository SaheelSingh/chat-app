const express = require('express');
const cors = require('cors');
const connectDb = require('./db');
const userRoute = require('./routes/userRoute');
const chatRoute = require('./routes/chatRoute');
const messageRoute = require('./routes/messageRoute');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

dotenv.config();
connectDb();
const app = express();

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));

app.use('/api/user', userRoute);
app.use('/api/chat', chatRoute);
app.use('/api/message', messageRoute);

const server = app.listen(4000, () => {
    console.log('listening on port 4000 er');
});

let onlineUsers = [];

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:3000'
    }
});

io.on("connection", (socket) => {
    console.log(socket);
    console.log("connected to socket.io")

    socket.on("setup", (userData) => {
        if(userData){
            console.log(userData);
            socket.join(userData._id);
            socket.emit("connected");
        }
        return;
    })

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User joined room " + room);
    })

    socket.on("new message", (newMessage) => {
        var chat = newMessage.chat;

        chat.users.forEach((user) => {
            //check if logged in user is equals to sender then return
            if(user._id == newMessage.sender) return;

            socket.in(user._id).emit("message recieved", newMessage);
        });
    })

    socket.off("setup", () => {
        console.log("Disconnected");
        socket.leave(userData._id);
    })
})