const express = require('express');
const validateUser = require('../middlewares/authentication');
const { handleGetCart, handleAddToCart, handleUpdateCartItem, handleRemoveCartItem } = require('../controllers/cartControllers');
const router = express.Router();


router.get('/', validateUser, handleGetCart);
router.post('/add', validateUser, handleAddToCart);
router.put('/update/:cartItemId/:quantity', validateUser, handleUpdateCartItem);
router.delete('/remove/:cartItemId', validateUser, handleRemoveCartItem);

module.exports = router;