'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

interface TopProductsChartProps {
  products: Array<{
    name: string;
    sales: number;
    stock: number;
    price: number;
  }>;
}

export default function TopProductsChart({ products }: TopProductsChartProps) {
  // Top 10 products by sales
  const topSalesProducts = [...products]
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 10)
    .map((p) => ({
      name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
      sales: p.sales,
      revenue: p.sales * p.price,
      stock: p.stock,
    }));

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-black mb-4">Top Selling Products</h3>
      
      {/* Top Products by Sales */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Top 10 Products by Sales</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topSalesProducts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#82ca9d" name="Sales" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Sales vs Stock Comparison */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Sales vs Stock (Top 10)</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topSalesProducts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="stock" fill="#8884d8" name="Stock" />
            <Bar yAxisId="right" dataKey="sales" fill="#82ca9d" name="Sales" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

