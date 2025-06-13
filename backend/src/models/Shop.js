import { Schema, model, Types } from "mongoose";

const BannerSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    link: {
      type: String,
    },
    buttonText: {
      type: String,
    },
    image: {
      type: String
    },
  },
  { _id: false }
);

const ShopSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  banner: {
    type: BannerSchema,
  },
  logo: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model("Shop", ShopSchema);