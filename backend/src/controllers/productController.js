import Product from '../models/Product.js';

// Criar um novo produto
export async function createProduct(req, res) {
    try {
        const { name, description, price, stock, category, images } = req.body;
        console.log(req.body);
        const averageRating = 0;

        const product = await Product.create({ name, description, price, stock, category, images, averageRating });

        res.status(201).json({ product });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error(error.message);
    }
}

// Obter todos os produtos
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('reviews');
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obter produto por ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate({
            path: 'reviews',
            populate: {
                path: 'user',
                select: 'name'
            }
        });
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
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

// Adicionar desconto a um produto
export const updateProductDiscount = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, value, start_date, end_date } = req.body;

        const updated = await Product.findByIdAndUpdate(id, {
            discount: { type, value, start_date, end_date }
        }, { new: true });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

