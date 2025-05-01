import { Schema, model } from "mongoose";

const DiscountSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    start_date: {
      type: Date,
    },
    end_date: {
      type: Date,
    },
  },
  { _id: false }
);

const colorSchema = Schema(
  {
    name: String,
    hex: String,
  },
  { _id: false }
);

const sizeSchema = Schema(
  {
    name: String,
    size: String,
  },
  { _id: false }
);

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: DiscountSchema,
    default: null,
  },
  stock: {
    type: Number,
    required: true,
  },
  colors: [colorSchema],
  sizes: [sizeSchema],
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  averageRating: {
    type: Number,
    default: 0,
  },
  category: [
    {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  images: [
    {
      type: String,
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model("Product", ProductSchema);