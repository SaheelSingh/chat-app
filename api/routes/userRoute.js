const express = require('express');
const {signupUser, authUser, allUsers} = require('../controllers/userController');
const {protect} = require('../middleware/AuthMiddleware');

const router = express.Router();

router.route('/').post(signupUser);
router.route('/').get(protect, allUsers);
router.route('/login').post(authUser);

module.exports = router;