const express = require('express');
const validateUser = require('../middlewares/authentication');
const { authorizeAdmin } = require('../middlewares/authorization');
const { handleApproveSellerApplication } = require('../controllers/adminControllers');
const router = express.Router();

router.post('/approve-application/:sellerId', validateUser, authorizeAdmin, handleApproveSellerApplication);

module.exports = router;