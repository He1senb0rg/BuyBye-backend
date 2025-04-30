import Review from '../models/Review.js';
import Product from '../models/Product.js';

export const updateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId });

  if (reviews.length === 0) {
    await Product.findByIdAndUpdate(productId, { averageRating: 0 });
    return;
  }

  const average = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  await Product.findByIdAndUpdate(productId, { averageRating: average.toFixed(1) });
};