import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { requireAuth } from '@/lib/auth';

async function getStats(req: NextRequest) {
  try {
    await connectDB();

    const [
      totalProducts,
      activeProducts,
      totalStock,
      totalSales,
      lowStockProducts,
      categoryStats,
      topSellingProducts,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ status: 'active' }),
      Product.aggregate([
        { $group: { _id: null, total: { $sum: '$stock' } } },
      ]),
      Product.aggregate([
        { $group: { _id: null, total: { $sum: '$sales' } } },
      ]),
      Product.countDocuments({ stock: { $lt: 10 } }),
      Product.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 }, totalSales: { $sum: '$sales' } } },
        { $sort: { count: -1 } },
      ]),
      Product.find().sort({ sales: -1 }).limit(5).select('name sales'),
    ]);

    return NextResponse.json({
      stats: {
        totalProducts,
        activeProducts,
        totalStock: totalStock[0]?.total || 0,
        totalSales: totalSales[0]?.total || 0,
        lowStockProducts,
        categoryStats,
        topSellingProducts,
      },
    });
  } catch (error: any) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(getStats);

