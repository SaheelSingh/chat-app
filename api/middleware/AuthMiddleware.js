const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(" ")[1];

            // decodes token id
            const decode = jwt.verify(token, process.env.jwtSecret);

            req.user = await User.findById(decode.id).select("-password");

            next();
        } catch (error) {
            res.status(400)
            res.json("Not authorized, token failed!")
        }
    }
    if(!token) {
        res.status(401);
        res.json("Not authorized, no token!")
    }
}

module.exports = { protect };