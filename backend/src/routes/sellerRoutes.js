const express = require('express');

const validateUser = require('../middlewares/authentication');
const { handleCreateSellerApplication } = require('../controllers/sellerControllers');
const { authorizeUser } = require('../middlewares/authorization');

const router = express.Router();

router.post('/apply', validateUser, authorizeUser(['customer']), handleCreateSellerApplication);

module.exports = router;