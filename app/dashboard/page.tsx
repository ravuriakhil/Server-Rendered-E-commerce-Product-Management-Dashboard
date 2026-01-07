import DashboardLayout from '@/components/DashboardLayout';
import ProductList from '@/components/ProductList';
import StatsCards from '@/components/StatsCards';
import SalesChart from '@/components/SalesChart';
import StockChart from '@/components/StockChart';
import TopProductsChart from '@/components/TopProductsChart';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { getCurrentUserFromCookies } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

async function getProducts() {
  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 }).limit(10).lean();
  return JSON.parse(JSON.stringify(products));
}

async function getStats() {
  await connectDB();
  
  const [
    totalProducts,
    activeProducts,
    totalStock,
    totalSales,
    lowStockProducts,
    categoryStats,
    allProducts,
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
    Product.find().select('name stock sales price category').lean(),
  ]);

  return {
    totalProducts,
    activeProducts,
    totalStock: totalStock[0]?.total || 0,
    totalSales: totalSales[0]?.total || 0,
    lowStockProducts,
    categoryStats: JSON.parse(JSON.stringify(categoryStats)),
    allProducts: JSON.parse(JSON.stringify(allProducts)),
  };
}

export default async function DashboardPage() {
  const headersList = headers();
  const cookieHeader = headersList.get('cookie');
  
  const user = await getCurrentUserFromCookies(cookieHeader);

  if (!user) {
    redirect('/login');
  }

  const [products, stats] = await Promise.all([getProducts(), getStats()]);

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        </div>

        <StatsCards stats={stats} />

        <div className="mt-8 grid grid-cols-1 gap-6">
          {/* Sales and Stock Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SalesChart categoryStats={stats.categoryStats} />
            <StockChart products={stats.allProducts || []} />
          </div>

          {/* Top Products Chart */}
          <TopProductsChart products={stats.allProducts || []} />

          {/* Recent Products */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Recent Products</h3>
            <ProductList initialProducts={products} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

