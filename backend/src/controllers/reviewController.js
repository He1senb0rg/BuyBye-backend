import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { updateProductRating } from '../utils/updateProductRating.js';
import mongoose from 'mongoose';

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

        // Atualiza a classificação média do produto
        await updateProductRating(productId);

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

        // Atualiza a classificação média do produto
        await updateProductRating(updated.product._id);

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

        // Atualiza a classificação média do produto
        await updateProductRating(product.product._id);

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

// Obter estatísticas de avaliações por produto
export const getReviewStatsByProduct = async (req, res) => {
    try {
      const { id } = req.params;
  
      const stats = await Review.aggregate([
        {
          $match: {
            product: new mongoose.Types.ObjectId(id),
          },
        },
        {
          $group: {
            _id: '$rating',
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: -1 },
        },
      ]);
  
      // Inicializa todos os valores de 1 a 5 com 0
      const result = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      };
  
      stats.forEach((item) => {
        result[item._id] = item.count;
      });
  
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };