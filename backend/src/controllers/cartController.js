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

// Add or update an item in the cart
export const addToCart = async (req, res) => {
  const { productId, quantity = 1, selectedColor, selectedSize } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Produto não encontrado." });

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) cart = new Cart({ user: req.user.id, items: [] });

    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        return res.status(400).json({ message: `Quantidade excede o stock disponível (${product.stock}).` });
      }
      existingItem.quantity = newQuantity;
    } else {
      if (quantity > product.stock) {
        return res.status(400).json({ message: `Apenas ${product.stock} unidades disponíveis.` });
      }
      cart.items.push({ product: productId, quantity, selectedColor, selectedSize });
    }

    cart.updatedAt = Date.now();
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Erro ao adicionar ao carrinho.", error });
  }
};

// Remove one unit or variation of an item
export const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const { selectedColor, selectedSize } = req.body; // May be undefined

  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Carrinho não encontrado." });

    // Filter out matching items (i.e., remove them)
    cart.items = cart.items.filter((item) => {
      const isSameProduct = item.product.toString() === productId;
      const colorMatches = selectedColor === undefined || item.selectedColor === selectedColor;
      const sizeMatches = selectedSize === undefined || item.selectedSize === selectedSize;

      // Keep item if it DOESN'T match the criteria (i.e., exclude from deletion)
      return !(isSameProduct && colorMatches && sizeMatches);
    });

    cart.updatedAt = Date.now();
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Erro ao remover item do carrinho.", error });
  }
};

// Update item quantity
export const updateCartItem = async (req, res) => {
  const { productId } = req.params;
  const { quantity, selectedColor = null, selectedSize = null } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Produto não encontrado." });

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Carrinho não encontrado." });

    const item = cart.items.find((i) => {
      return (
        i.product.toString() === productId &&
        (i.selectedColor ?? null) === selectedColor &&
        (i.selectedSize ?? null) === selectedSize
      );
    });

    if (!item) {
      return res.status(404).json({ message: "Item não encontrado no carrinho com essa variação." });
    }

    if (quantity > product.stock) {
      return res.status(400).json({ message: `Stock insuficiente. Máximo: ${product.stock}` });
    }

    item.quantity = quantity;
    cart.updatedAt = Date.now();
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar item do carrinho.", error });
  }
};

// Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Carrinho não encontrado." });

    cart.items = [];
    cart.updatedAt = Date.now();
    await cart.save();

    res.status(200).json({ message: "Carrinho limpo com sucesso.", cart });
  } catch (error) {
    res.status(500).json({ message: "Erro ao limpar o carrinho.", error });
  }
}