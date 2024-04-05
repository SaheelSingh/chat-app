const generateToken = require("../config/generateToken");
const bycrpt = require('bcryptjs');
const User = require("../models/User");

const salt = bycrpt.genSaltSync(10);

const signupUser = async (req, res) => {
    const {email, username, password, pic} = req.body;

    //check if all field is filled
    if(!email || !username || !password) {
        res.status(400);
        res.json("Please fill all the field!");
    }

    //check if user already exists
    const userExist = await User.findOne({ username })
    if(userExist) {
        res.status(400);
        res.json("User already exist please enter unique username!");
    }

    const hashPassword = bycrpt.hashSync(password, salt)

    const user = await User.create({
        email: email,
        username: username,
        password: hashPassword,
        pic: pic,
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            email: user.email,
            username: user.username,
            password: user.password,
            pic: user.pic,
            token: generateToken(user._id)
        })
    }
    else {
        res.status(400);
        res.json("Failed to sign up the user!")
    }
}

const authUser = async (req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({ username })

    if(!username || !password) {
        res.status(400);
        res.json("Please fill all the fields!")
    }

    if(user) {
        const passOk = bycrpt.compareSync(password, user.password)
        if(passOk) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                password: user.password,
                pic: user.pic,
                token: generateToken(user._id)
            })
        } else {
            res.status(400);
            res.json("Invalid username and password!")
        }   
    } else {
        res.status(400);
        res.json("User not found! Please enter correct username")
    }
}

const allUsers = async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [
                {username: { $regex: req.query.search, $options: "i"}}, //option i means case-insensitive
                {email: { $regex: req.query.search, $options: "i"}}
            ]
        } : {};
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }); //$ne - select an login user
    res.send(users);
}

module.exports = {signupUser, authUser, allUsers};