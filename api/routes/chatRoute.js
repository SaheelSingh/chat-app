const express = require('express');
const { protect } = require('../middleware/AuthMiddleware');
const { accessChat, fetchChat } = require('../controllers/chatController');

const router = express.Router();

router.route('/').post(protect, accessChat);
router.route('/').get(protect, fetchChat);

module.exports = router;