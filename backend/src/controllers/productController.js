import Product from '../models/Product.js';

// Criar um novo produto
export async function createProduct(req, res) {
    try {
        const { name, description, price, stock, category, images } = req.body;

        const product = await Product.create({ name, description, price, stock, category, images });

        res.status(201).json({ product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Obter todos os produtos
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obter produto por ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Atualizar produto
export const updateProduct = async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ message: 'Produto não encontrado' });
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
        res.json({ message: 'Produto apagado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
