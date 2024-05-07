const express = require('express');
const cors = require('cors');
const connectDb = require('./db');
const userRoute = require('./routes/userRoute');
const chatRoute = require('./routes/chatRoute');
const messageRoute = require('./routes/messageRoute');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const multer = require('multer');
const { saveMessage } = require('./controllers/messageController');
const fs = require('fs').promises;

dotenv.config();
connectDb();
const app = express();

app.use(express.json());
app.use('/images', express.static(__dirname + '/uploads'));
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

const connectedUsers = new Map();


const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:3000'
    }
});

io.on("connection", (socket) => {
    console.log("connected to socket.io %s",socket.id)

    socket.on("setup", (userData) => {
        if (userData) {
            console.log(userData);
            connectedUsers.set(userData._id, socket.id)
            socket.join(userData._id);
            socket.emit("connected");
        }
        return;
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User joined room " + room);
    });

    let filename = null;
   
    socket.on("upload file", async ({file, content, chatId,sender}) => {
        try{
        console.log(12345);
        io.sockets.emit('test123' , 123);
        const files = file
        const parts = files.name.split('.');
        const ext = parts[parts.length - 1];
        filename = Date.now() + '.' + ext;
        const path = __dirname + '/uploads/' + filename;
        const bufferData = new Buffer(files.data.split(',')[1], 'base64');
        const newMessage = {
            chatId: chatId,
            chat: chatId,
            file: filename,
            content: content,
            sender
        }
           console.log(newMessage);
            await fs.writeFile(path, bufferData);
            const result = await saveMessage(newMessage);
                console.log('**********');
                console.log(result);
                console.log('**********');
                
                socket.emit("sync_message",result);
                console.log('File written successfully');

        } catch (err) {
            console.error('Error writing file:', err);
        }
    });

    socket.on("new message", (newMessage) => {
        var chat = newMessage.chat;
        console.log('((((((((((((((((((((((((((((((((');
        console.log(newMessage.chat.users)
        console.log('((((((((((((((((((((((((((((((((');

        chat.users.forEach((user) => {
            //check if logged in user is equals to sender then return
            if (user._id == newMessage.sender) return;

            socket.in(user._id).emit("message recieved", newMessage);
        });
    });
});
