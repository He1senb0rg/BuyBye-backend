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
    type: ShippingAddressSchema,
    required: true,
  },
  phoneNumber: {
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