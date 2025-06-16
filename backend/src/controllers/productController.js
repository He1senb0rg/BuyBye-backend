import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import Wishlist from "../models/Wishlist.js";
import Review from "../models/Review.js";
import Order from "../models/Order.js";
import { mapImageIdsToUrls } from "../utils/fileHelpers.js";

export async function createProduct(req, res) {
  try {

    let { name, description, price, stock, category, discount_type, discount_value } = req.body;

    if (!name || !description || isNaN(price) || isNaN(stock) || !category) {
      process.stdout.write(res.status(400).json({ error: "Missing or invalid required fields" }));
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

    // Map image IDs to URLs for each product
    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const imagesWithUrls = await mapImageIdsToUrls(product.images);
        return { ...product.toObject(), images: imagesWithUrls };
      })
    );

    res.json({ products: productsWithImages, totalProducts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter produto por ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate({
      path: "reviews",
      populate: { path: "user", select: "name" },
    });
    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    product.reviews.sort((a, b) => b.createdAt - a.createdAt);

    const imagesWithUrls = await mapImageIdsToUrls(product.images);

    res.json({ ...product.toObject(), images: imagesWithUrls });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Atualizar produto
export const updateProduct = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "No form data received" });
    }

    const { id } = req.params;
    const { name, description, price, stock, category, discount } = req.body;
    const files = req.files || [];

    const existingImages = req.body.existingImages
      ? Array.isArray(req.body.existingImages)
        ? req.body.existingImages
        : [req.body.existingImages]
      : [];

    let discountObj = null;
    if (discount && typeof discount === 'string') {
      try {
        discountObj = JSON.parse(discount);
      } catch (e) {
        console.error('Error parsing discount:', e);
      }
    }

    const updateData = {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      ...(discountObj && { discount: discountObj }),
    };

    if (files.length > 0) {
      const newImages = files.map(file => file.id || file._id);
      updateData.images = [...existingImages, ...newImages];
    } else {
      updateData.images = existingImages;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('category');

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const imageUrls = await mapImageIdsToUrls(updatedProduct.images);

    return res.status(200).json({
      success: true,
      product: {
        ...updatedProduct.toObject(),
        images: imageUrls,
      }
    });

  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
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

// Obter todos os produtos que têm desconto
export const getAllProductsWithDiscount = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortOption = req.query.sort;

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
      discount: { $exists: true, $ne: null },
    })
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .populate("reviews")
      .populate("category");

    const totalProducts = await Product.countDocuments({
      discount: { $exists: true, $ne: null },
    });

    res.json({ products, totalProducts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};