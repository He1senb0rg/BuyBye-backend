import Category from "../models/Category.js";
import Product from "../models/Product.js";

// Criar uma nova categoria
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Verifica se a categoria já existe
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Categoria já existe" });
    }

    const category = await Category.create({ name, description });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter todas as categorias
export const getAllCategories = async (req, res) => {
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

    const categories = await Category.find({
      name: { $regex: search, $options: "i" },
    })
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    const totalCategories = await Category.countDocuments({
      name: { $regex: search, $options: "i" },
    });
    res.json({categories, totalCategories});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter categoria por ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar categoria
export const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Verifica se a categoria já existe
    const existingCategory = await Category.findOne({
      name,
      _id: { $ne: req.params.id },
    });
    if (existingCategory) {
      return res.status(400).json({ message: "Categoria já existe" });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!updatedCategory) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Apagar categoria
export const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }

    // apagar todos os produtos associados a esta categoria
    await Product.deleteMany({ category: req.params.id });

    res.json({ message: "Categoria apagada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
