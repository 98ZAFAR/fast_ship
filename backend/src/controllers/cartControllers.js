const CartItem = require("../models/cartItemModel");
const Cart = require("../models/cartModel");

const handleAddToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        let cart = await Cart.findOne({ where: { userId } });

        if(!cart) {
            cart = await Cart.create({ userId, totalPrice: 0 });
        }
        const existingCartItem = await CartItem.findOne({
            where: { cartId: cart.id, productId }
        });
        if (existingCartItem) {
            existingCartItem.quantity += quantity || 1;
            await existingCartItem.save();
            cart.totalPrice += existingCartItem.quantity * (await existingCartItem.getProduct()).price;
            await cart.save();
            return res.status(200).json({
                success: true,
                message: "Item quantity updated in cart",
                data: { cartItem: existingCartItem }
            });
        }

        const cartItem = await CartItem.create({
            cartId: cart.id,
            productId,
            quantity:quantity || 1
        });


        cart.totalPrice += cartItem.quantity * (await cartItem.getProduct()).price;
        await cart.save();
        res.status(201).json({
            success: true,
            message: "Item added to cart successfully",
            data:{cartItem}
        });
    } catch (error) {
        console.error("Error adding item to cart:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add item to cart",
            error: error.message || "Internal Server Error"
        });
    }
};

const handleGetCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({
            where: { userId },
            include: [{
                model: CartItem,
                as: 'cartItems',
                include: ['product']
            }]
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Cart fetched successfully",
            data: {cart}
        });
    } catch (error) {
        console.error("Error fetching cart items:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch cart items",
            error: error.message || "Internal Server Error"
        });
    }
};

const handleUpdateCartItem = async (req, res) => {
    try {
        const { cartItemId, quantity } = req.params;
        const userId = req.user.id;

        const cartItem = await CartItem.findOne({
            where: { id: cartItemId },
            include: [{ model: Cart, as: 'cart', where: { userId } }]
        });

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found"
            });
        }

        if(quantity) cartItem.quantity = quantity;
        else cartItem.quantity += 1;
        if(cartItem.quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"
            });
        }
        await cartItem.save();

        // Update total price in the cart
        const cart = await Cart.findByPk(cartItem.cartId);
        cart.totalPrice = cart.cartItems.reduce((total, item) => {
            return total + (item.quantity * item.product.price);
        }, 0);
        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart item updated successfully",
            data: {cartItem}
        });
    } catch (error) {
        console.error("Error updating cart item:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update cart item",
            error: error.message || "Internal Server Error"
        });
    }
};

const handleRemoveCartItem = async (req, res) => {
    try {
        const { cartItemId } = req.params;
        const userId = req.user.id;

        const cartItem = await CartItem.findOne({
            where: { id: cartItemId },
            include: [{ model: Cart, as: 'cart', where: { userId } }]
        });

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found"
            });
        }

        await cartItem.destroy();

        // Update total price in the cart
        const cart = await Cart.findByPk(cartItem.cartId);
        cart.totalPrice = cart.cartItems.reduce((total, item) => {
            return total + (item.quantity * item.product.price);
        }, 0);
        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart item removed successfully",
            data: {cart}
        });
    } catch (error) {
        console.error("Error removing cart item:", error);
        res.status(500).json({
            success: false,
            message: "Failed to remove cart item",
            error: error.message || "Internal Server Error"
        });
    }
}

module.exports = {
    handleAddToCart,
    handleGetCart,
    handleUpdateCartItem,
    handleRemoveCartItem
};