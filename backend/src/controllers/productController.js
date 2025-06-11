import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import Wishlist from "../models/Wishlist.js";
import Review from "../models/Review.js";
import Order from "../models/Order.js";

// Criar um novo produto
export async function createProduct(req, res) {
  try {
    const { name, description, price, stock, category, images, discount_type, discount_value } = req.body;
    console.log(req.body);
    const averageRating = 0;

    const productData = {
      name,
      description,
      price,
      stock,
      category,
      images,
      averageRating,
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
    res.status(500).json({ error: error.message });
    console.error(error.message);
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
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
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

    // Remover o produto de todos os carrinhos, listas de desejos, avaliações e compras
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
    console.log("ola")

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
      discount: {$exists: true},
    })
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .populate("reviews")
      .populate("category");

    const totalProducts = await Product.countDocuments({
      discount: {$exists: true},
    });

    res.json({ products, totalProducts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
