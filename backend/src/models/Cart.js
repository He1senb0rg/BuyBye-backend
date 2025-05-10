import { Schema, model } from "mongoose";

const CartItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    wishlisted: {
      type: Boolean,
      default: false,
    },
    selectedColor: {
      type: String, // e.g., "Red"
    },
    selectedSize: {
      type: String, // e.g., "M"
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const CartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // One cart per user
  },
  items: [CartItemSchema],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default model("Cart", CartSchema);