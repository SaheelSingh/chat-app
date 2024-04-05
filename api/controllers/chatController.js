const Chat = require("../models/Chat");
const User = require("../models/User");

const accessChat = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        console.log('UserId params not sent with request');
        res.sendStatus(400);
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    }).populate('users', '-password').populate('latestMessage');

    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select: 'name pic email'
    });

    if (isChat.length > 0) {
        res.send(isChat[0])
    }
    else {
        var chatData = {
            chatName: 'sender',
            isGroupChat: false,
            users: [req.user._id, userId]
        }
    }

    try {
        const createChat = await Chat.create(chatData);
        const fullChat = await Chat.findOne({ _id: createChat._id }).populate('users', '-password')
        res.status(200).json(fullChat)
    } catch (error) {
        console.log('error occur')
        res.status(400)
    }
}

const fetchChat = async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate('users', '-password')
        .populate('latestMessage')
        .sort({ updatedAt: -1 })
        .then(async(results) => {
            results = await User.populate(results, {
                path: 'latestMessage.sender',
                select: 'name email pic'
            })
            res.status(200).send(results)
        })

    } catch (error) {
        res.status(401)
        res.json(error)
    }
}

module.exports = { accessChat, fetchChat };