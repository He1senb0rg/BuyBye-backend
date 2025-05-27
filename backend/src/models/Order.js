// models/Order.js
import { Schema, model } from 'mongoose';

const OrderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  selectedColor: String,
  selectedSize: String,
  price: Number,
});

const OrderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [OrderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  shippingAddress: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['ccdb', 'paypal', 'multibanco', 'mbway'],
    required: true,
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'paid', 'shipped', 'delivered'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model('Order', OrderSchema);