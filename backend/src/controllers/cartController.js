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

// Remove one unit of a specific item variation (by color/size) from the cart
export const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const { selectedColor, selectedSize } = req.body; // expect from body

  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Carrinho não encontrado." });

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item com essa variação não encontrado no carrinho." });
    }

    const item = cart.items[itemIndex];

    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      // Remove item entirely if quantity becomes zero
      cart.items.splice(itemIndex, 1);
    }

    cart.updatedAt = Date.now();
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
        return res.status(400).json({ message: `Stock insuficiente. Máximo: ${product.stock}` });
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
};

// Update item status (e.g., saved, active, removed)
export const updateCartItemStatus = async (req, res) => {
  const { productId } = req.params;
  const { status } = req.body;

  const allowedStatuses = ['active', 'saved', 'removed'];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: `Status inválido. Permitidos: ${allowedStatuses.join(', ')}` });
  }

  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Carrinho não encontrado." });
    }

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: "Item não encontrado no carrinho." });
    }

    item.status = status;
    cart.updatedAt = Date.now();
    await cart.save();

    res.status(200).json({ message: 'Status atualizado com sucesso.', cart });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar o status do item.", error });
  }
};
