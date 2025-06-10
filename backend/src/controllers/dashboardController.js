// src/controllers/dashboardController.js
import Order from '../models/Order.js';

export const getDashboardSummary = async (req, res) => {
  try {
    const result = await Order.aggregate([
      {
        $match: {
          orderStatus: { $in: ['pending', 'paid', 'shipped', 'delivered'] }
        }
      },
      { $unwind: '$items' },
      {
        $project: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          quantity: '$items.quantity',
          totalAmount: 1
        }
      },
      {
        $group: {
          _id: { year: '$year', month: '$month' },
          totalItemsSold: { $sum: '$quantity' },
          totalRevenue: { $sum: '$totalAmount' }
        }
      },
      {
        $project: {
          _id: 0,
          month: '$_id.month',
          year: '$_id.year',
          totalItemsSold: 1,
          totalRevenue: 1
        }
      },
      { $sort: { year: 1, month: 1 } }
    ]);

    res.json(result);
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
