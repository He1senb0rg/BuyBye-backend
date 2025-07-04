import User from "../models/User.js";
import bcrypt from "bcryptjs"
import Cart from "../models/Cart.js";
import Wishlist from "../models/Wishlist.js";
import Review from "../models/Review.js";
import Order from "../models/Order.js";

// Obter todos os users
export async function getAllUsers(req, res) {
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

    const users = await User.find({
      name: { $regex: search, $options: "i" },
    })
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select("-password");

    const totalUsers = await User.countDocuments({
      name: { $regex: search, $options: "i" },
    });
    
    res.json({users, totalUsers});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Obter user por ID
export async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "Utilizador não encontrado" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Atualizar user
export async function updateUser(req, res) {
  try {
    const { name, email, role, phone } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Utilizador não encontrado" });
    }

    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists && emailExists._id.toString() !== req.params.id) {
        return res.status(400).json({ error: "Email já está em uso" });
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.phone = phone !== undefined ? phone : user.phone;

    await user.save();

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Apagar user
export async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Utilizador não encontrado" });
    }

    // apagar dados relacionados
    await User.deleteMany({ user: req.params.id });
    await Cart.deleteMany({ user: req.params.id });
    await Wishlist.deleteMany({ user: req.params.id });
    await Review.deleteMany({ user: req.params.id });
    await Order.deleteMany({ user: req.params.id });
    
    res.json({ message: "Utilizador deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Remover imagem
export async function removeImage(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Utilizador não encontrado" });
    }
    user.image = "/assets/images/account-profile.png";
    await user.save();
    res.json({ message: "Imagem removida com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//Mudar password

export async function updatePassword(req, res) {
  try {
    const user = await User.findById(req.params.id).select("+password");
    if (!user) {
      return res.status(404).json({ error: "Utilizador não encontrado" });
    }

    const { currentPassword, newPassword } = req.body;

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Palavra-passe atual incorreta" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Palavra-passe atualizada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}