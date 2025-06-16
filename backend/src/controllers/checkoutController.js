import User from '../models/User.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
  try {
    const { paymentMethod, shippingAddress, phoneNumber, totalAmount } = req.body; // <-- Accept totalAmount from frontend
    const userId = req.user.id;

    // Validate input
    if (!paymentMethod || !shippingAddress || !phoneNumber) {
      return res.status(400).json({ message: 'Payment method, shipping address, and phone number are required.' });
    }

    // Validate totalAmount (basic check)
    if (typeof totalAmount !== 'number' || totalAmount <= 0) {
      return res.status(400).json({ message: 'Invalid total amount.' });
    }

    // Validate phone number (basic check)
    if (typeof phoneNumber !== 'string' || phoneNumber.trim().length < 6) {
      return res.status(400).json({ message: 'Invalid phone number.' });
    }

    // Fetch user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Fetch cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart || !cart.items.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Get product details
    const productIds = cart.items.map(item => item.product);
    const products = await Product.find({ _id: { $in: productIds } });

    if (!products.length) {
      return res.status(400).json({ message: 'Products not found' });
    }

    const items = [];

    for (const item of cart.items) {
      const product = products.find(p => p._id.toString() === item.product.toString());

      if (!product) {
        return res.status(400).json({ message: `Product not found: ${item.product}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for product: ${product.name}` });
      }

      items.push({
        product: product._id,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
        price: product.price,
      });
    }

    // Validate shippingAddress structure
    const { address, city, state, zip } = shippingAddress;
    if (!address || !city || !state || !zip) {
      return res.status(400).json({ message: 'Morada incompleta.' });
    }

    // Create order using totalAmount from frontend
    const order = new Order({
      user: user._id,
      items,
      totalAmount,  // use frontend calculated amount
      shippingAddress: {
        address,
        city,
        state,
        zip,
      },
      phoneNumber,
      paymentMethod,
      orderStatus: 'pending',
    });

    await order.save();

    // Update product stock
    await Promise.all(
      items.map(async item => {
        const product = await Product.findById(item.product);
        product.stock -= item.quantity;
        await product.save();
      })
    );

    // Clear the cart
    await Cart.deleteOne({ user: userId });

    res.status(201).json({
      message: 'Pedido criado com sucesso.',
      orderId: order._id,
      totalAmount,
      items: order.items,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Erro ao criar o pedido.',
      error: err.message,
      stack: err.stack,
    });
  }
};

export const getBillingHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name images price')
      .populate('user', 'name');

    if (!orders.length) {
      return res.status(404).json({ message: 'Pedidos não encontrados' });
    }

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao encontrar o histórico de faturamento.' });
  }
};

export const getOrders = async (req, res) => {
  try {
      const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate('items.product', 'name images price discount')
      .populate('user', 'name');

    if (!orders.length) {
      return res.status(404).json({ message: 'Pedidos não encontrados' });
    }

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao encontrar o histórico de faturamento.' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const id = req.params.id;

    if (!orderStatus || typeof orderStatus !== 'string') {
      return res.status(400).json({ message: 'orderStatus is required and must be a string.' });
    }

    // Optional: define allowed statuses
    const allowed = ['pending', 'paid', 'shipped', 'delivered'];
    if (!allowed.includes(orderStatus)) {
      return res.status(400).json({ message: `Invalid status. Allowed: ${allowed.join(', ')}` });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
};