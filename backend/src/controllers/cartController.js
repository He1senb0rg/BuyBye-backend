import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Get a user's cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    res.json(cart || { user: req.user.id, items: [] });
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter o carrinho.", error });
  }
};

// Add or update an item
export const addToCart = async (req, res) => {
    const { productId, quantity = 1, selectedColor, selectedSize } = req.body;
  
    try {
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ message: "Produto não encontrado." });
  
      if (quantity > product.stock) {
        return res.status(400).json({ message: `Apenas ${product.stock} unidades disponíveis.` });
      }
  
      let cart = await Cart.findOne({ user: req.user.id }) || new Cart({ user: req.user.id, items: [] });
  
      const existingItem = cart.items.find(
        (item) =>
          item.product.toString() === productId &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
      );
  
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          return res.status(400).json({ message: `Quantidade excede o estoque disponível (${product.stock}).` });
        }
        existingItem.quantity = newQuantity;
      } else {
        cart.items.push({ product: productId, quantity, selectedColor, selectedSize });
      }
  
      cart.updatedAt = Date.now();
      await cart.save();
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: "Erro ao adicionar ao carrinho.", error });
    }
  };

// Remove item
export const removeFromCart = async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Carrinho não encontrado." });

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Erro ao remover item do carrinho.", error });
  }
};

// Update quantity or wishlist
export const updateCartItem = async (req, res) => {
    const { productId } = req.params;
    const { quantity, wishlisted } = req.body;
  
    try {
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ message: "Produto não encontrado." });
  
      const cart = await Cart.findOne({ user: req.user.id });
      const item = cart?.items.find((i) => i.product.toString() === productId);
  
      if (!item) return res.status(404).json({ message: "Item não encontrado no carrinho." });
  
      if (quantity !== undefined) {
        if (quantity > product.stock) {
          return res.status(400).json({ message: `Estoque insuficiente. Máximo: ${product.stock}` });
        }
        item.quantity = quantity;
      }
  
      if (wishlisted !== undefined) item.wishlisted = wishlisted;
  
      cart.updatedAt = Date.now();
      await cart.save();
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar item do carrinho.", error });
    }
  };