const express = require('express');
const { handleCreateUser, handleLoginUser, handleVerifyEmail } = require('../controllers/userControllers');
const router = express.Router();

router.post('/register', handleCreateUser);
router.post('/login', handleLoginUser);
router.get('/verify-email', handleVerifyEmail);

module.exports = router;