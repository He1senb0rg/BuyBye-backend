import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import Wishlist from "../models/Wishlist.js";
import Review from "../models/Review.js";
import Order from "../models/Order.js";

import fs from 'fs';

export async function createProduct(req, res) {
  try {
    process.stdout.write('==== New Create Product Request ====\n');
    process.stdout.write(`Request body: ${JSON.stringify(req.body)}\n`);
    process.stdout.write(`Request files: ${JSON.stringify(req.files)}\n`);


    let { name, description, price, stock, category, discount_type, discount_value } = req.body;

    price = parseFloat(price);
    stock = parseInt(stock);

    if (!name || !description || isNaN(price) || isNaN(stock) || !category) {
      return res.status(400).json({ error: "Missing or invalid required fields" });
    }

    const images = req.files && req.files.length > 0
      ? req.files.map(file => file.id)
      : [];

    const productData = {
      name,
      description,
      price,
      stock,
      category,
      images,
      averageRating: 0,
    };

    if (discount_type && discount_value !== "") {
      productData.discount = {
        type: discount_type,
        value: discount_value,
        start_date: null,
        end_date: null,
      };
    }

    const product = await Product.create(productData);

    res.status(201).json({ product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

// Obter todos os produtos
export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortOption = req.query.sort;
    const search = req.query.search || "";

    let sortBy = {};
    switch (sortOption) {
      case "nome_az":
        sortBy = { name: 1 };
        break;
      case "nome_za":
        sortBy = { name: -1 };
        break;
      case "mais_recente":
        sortBy = { createdAt: -1 };
        break;
      case "mais_antigo":
        sortBy = { createdAt: 1 };
        break;
      default:
        sortBy = { createdAt: -1 };
    }

    const products = await Product.find({
      name: { $regex: search, $options: "i" },
    })
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .populate("reviews")
      .populate("category");

    const totalProducts = await Product.countDocuments({
      name: { $regex: search, $options: "i" },
    });

    res.json({ products, totalProducts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter produto por ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate({
      path: "reviews",
      populate: {
        path: "user",
        select: "name",
      },
    });
    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    product.reviews.sort((a, b) => b.createdAt - a.createdAt);

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar produto
export const updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => `/api/files/${file.filename}`);
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Apagar produto
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    await Cart.deleteMany({ "items.product": req.params.id });
    await Wishlist.deleteMany({ product: req.params.id });
    await Review.deleteMany({ product: req.params.id });
    await Order.deleteMany({ "items.product": req.params.id });

    res.json({ message: "Produto apagado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
};