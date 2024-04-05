const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");

const sendMessages = async(req, res) => {
    const { content, chatId } = req.body;
    const newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    }

    try {
        var message = await Message.create(newMessage);
        message = await message.populate("sender", "username pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: 'chat.users',
            select: 'username pic email'
        })

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message
        })

        res.json(message);
    } catch (error) {
        console.log(error)
    }
}

const getMessages = async(req, res) => {
    try {
        const message = await Message.find({ chat: req.params.chatId })
        .populate('sender', 'username pic email')
        .populate('chat')
        res.json(message)
    } catch (error) {
        res.json(error)
    }
}

module.exports = { sendMessages, getMessages }