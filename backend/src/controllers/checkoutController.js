// controllers/checkoutController.js
import User from '../models/User.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
  try {
    const { userId, paymentMethod, shippingAddress, amount } = req.body;

    // Fetch user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Fetch cart for the user
    const cart = await Cart.findOne({ user: userId });
    if (!cart || !cart.items.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Fetch product details and calculate total amount
    const products = await Product.find({ '_id': { $in: cart.items.map(item => item.product) } });
    if (!products.length) {
      return res.status(400).json({ message: 'Products not found' });
    }

    const items = cart.items.map(item => {
      const product = products.find(p => p._id.toString() === item.product.toString());
      return {
        product: product._id,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
        price: product.price,
      };
    });

    // Calculate the total amount
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create an order
    const order = new Order({
      user: user._id,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
    });

    await order.save();

    // Optional: Clear the cart after placing the order
    await Cart.deleteOne({ user: userId });

    res.status(201).json({
      message: 'Order created successfully',
      orderId: order._id,
      totalAmount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating order' });
  }
};