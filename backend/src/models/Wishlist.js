// models/Wishlist.js
import { Schema, model } from 'mongoose';

// Schema for individual wishlist items
const WishlistItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

// Wishlist schema which contains multiple wishlist items
const WishlistSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [WishlistItemSchema],
});

export default model('Wishlist', WishlistSchema);