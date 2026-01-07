'use client';

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface StockChartProps {
  products: Array<{
    name: string;
    stock: number;
    category: string;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function StockChart({ products }: StockChartProps) {
  // Stock distribution by category
  const stockByCategory = products.reduce((acc, product) => {
    const category = product.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += product.stock;
    return acc;
  }, {} as Record<string, number>);

  const categoryStockData = Object.entries(stockByCategory).map(([name, value]) => ({
    name,
    value,
  }));


  // Top products by stock
  const topStockProducts = [...products]
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 10)
    .map((p) => ({
      name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
      stock: p.stock,
    }));

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg text-black font-semibold mb-4">Stock Metrics</h3>
      
      {/* Stock Distribution Pie Chart */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Stock by Category</h4>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryStockData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {categoryStockData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Top Products by Stock Bar Chart */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Top 10 Products by Stock</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topStockProducts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="stock" fill="#8884d8" name="Stock Quantity" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

