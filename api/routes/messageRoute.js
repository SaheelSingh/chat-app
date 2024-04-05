const express = require('express');
const { protect } = require('../middleware/AuthMiddleware');
const { sendMessages, getMessages } = require('../controllers/messageController');
const router = express.Router();

router.route('/').post(protect, sendMessages)
router.route('/:chatId').get(protect, getMessages);

module.exports = router;