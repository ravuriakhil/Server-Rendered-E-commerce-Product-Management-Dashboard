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
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface SalesChartProps {
  categoryStats: Array<{
    _id: string;
    count: number;
    totalSales: number;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function SalesChart({ categoryStats }: SalesChartProps) {
  const data = categoryStats.map((stat) => ({
    name: stat._id || 'Uncategorized',
    products: stat.count,
    sales: stat.totalSales,
  }));

  const pieData = data.map((item) => ({
    name: item.name,
    value: item.sales,
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-black mb-4">Sales Analytics</h3>
      
      {/* Sales by Category Bar Chart */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Sales by Category</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="products" fill="#8884d8" name="Products Count" />
            <Bar dataKey="sales" fill="#82ca9d" name="Total Sales" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Sales Distribution Pie Chart */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Sales Distribution by Category</h4>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

