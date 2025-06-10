import Order from '../models/Order.js';

export const getDashboardSummary = async (req, res) => {
  try {
    const result = await Order.aggregate([
      {
        $match: {
          orderStatus: { $in: ['paid', 'shipped', 'delivered'] }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: null,
          totalItemsSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$totalAmount' }
        }
      },
      {
        $project: {
          _id: 0,
          totalItemsSold: 1,
          totalRevenue: 1
        }
      }
    ]);

    const summary = result[0] || { totalItemsSold: 0, totalRevenue: 0 };
    res.json(summary);
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
