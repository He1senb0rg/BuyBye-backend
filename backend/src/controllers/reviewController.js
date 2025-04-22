import Review from '../models/Review.js';
import Product from '../models/Product.js';

// Criar uma nova avaliação
export const createReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.user.id;

        // Verifica se o produto existe
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        // Cria a nova avaliação
        const review = await Review.create({
            user: userId,
            product: productId,
            rating,
            comment
        });

        // Adiciona a avaliação ao produto
        product.reviews.push(review._id);
        await product.save();
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Obter todas as avaliações
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().populate('user', 'name');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obter avaliação por ID
export const getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id).populate('user', 'name');
        if (!review) {
            return res.status(404).json({ message: 'Avaliação não encontrada' });
        }
        res.json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obter todas as avaliações de um produto
export const getAllProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.id }).populate('user', 'name');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obter todas as avaliações de um usuário
export const getAllUserReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.params.id }).populate('product', 'name');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Atualizar avaliação
export const updateReview = async (req, res) => {
    try {
        // Garantir que o utilizador não pode atualizar o produto ou o utilizador da avaliação
        delete req.body.product;
        delete req.body.user;

        const updated = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ message: 'Avaliação não encontrada' });
        }
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Apagar avaliação
export const deleteReview = async (req, res) => {
    try {
        const product = await Review.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Avaliação não encontrada' });
        }
        res.json({ message: 'Avaliação apagada com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Obter avaliações de um usuário para um produto específico
export const getUserReviewForProduct = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const review = await Review.find({ user: userId, product: productId });
        if (!review) {
            return res.status(404).json({ message: 'Não existem avaliações' });
        }
        res.json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Obter média de avaliações de um produto
export const getProductRating = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await Review.find({ product: productId });
        if (reviews.length === 0) {
            return res.status(404).json({ message: 'Nenhuma avaliação encontrada para este produto' });
        }
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 1);
        const averageRating = totalRating / reviews.length;
        res.json({ averageRating });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}