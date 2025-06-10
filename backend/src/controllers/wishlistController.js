import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: userId,
        items: [{ product: productId }],
      });
    } else {
      const productExists = wishlist.items.some(item => item.product.toString() === productId);
      if (productExists) {
        return res.status(400).json({ message: 'Product already in wishlist' });
      }
      wishlist.items.push({ product: productId });
    }

    await wishlist.save();
    res.status(200).json({ message: 'Product added to wishlist', wishlist });
  } catch (error) {
    console.error('Error adding product to wishlist:', error);
    res.status(500).json({ message: 'Error adding product to wishlist', error: error.message });
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    const productIndex = wishlist.items.findIndex(item => item.product.toString() === productId);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in wishlist' });
    }

    wishlist.items.splice(productIndex, 1);
    await wishlist.save();

    res.status(200).json({ message: 'Product removed from wishlist', wishlist });
  } catch (error) {
    console.error('Error removing product from wishlist:', error);
    res.status(500).json({ message: 'Error removing product from wishlist', error: error.message });
  }
};

// Get all products in a user's wishlist
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({ user: userId }).populate('items.product');

    if (!wishlist) {
      return res.status(200).json({ items: [] });
    }

    res.status(200).json({ items: wishlist.items });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Check if a product is in the user's wishlist

export const checkIfInWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(200).json({ isWishlisted: false });
    }

    const isWishlisted = wishlist.items.some(item => item.product.toString() === productId);

    return res.status(200).json({ isWishlisted });
  } catch (error) {
    console.error('Error checking wishlist:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};