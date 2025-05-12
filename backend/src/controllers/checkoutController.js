import User from '../models/User.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
  try {
    const { userId, paymentMethod, shippingAddress } = req.body;

    // Validate request data
    if (!paymentMethod || !shippingAddress) {
      return res.status(400).json({ message: 'Payment method and shipping address are required.' });
    }

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

    // Fetch product details and check stock
    const products = await Product.find({
      _id: { $in: cart.items.map(item => item.product) },
    });

    if (!products.length) {
      return res.status(400).json({ message: 'Products not found' });
    }

    const items = cart.items.map(item => {
      const product = products.find(p => p._id.toString() === item.product.toString());

      // Check if the product is in stock
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for product: ${product.name}` });
      }

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
      status: 'pending',  // Adding order status for tracking
    });

    await order.save();

    // Optional: Update product stock after order is placed (if you're tracking stock)
    await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        product.stock -= item.quantity;  // Decrease stock
        await product.save();
      })
    );

    // Optional: Clear the cart after placing the order
    await Cart.deleteOne({ user: userId });

    res.status(201).json({
      message: 'Order created successfully',
      orderId: order._id,
      totalAmount,
      items: order.items,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating order' });
  }
};

// Fetch billing history for a logged-in user
export const getBillingHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name image price');

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found' });
    }

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching billing history.' });
  }
};