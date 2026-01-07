'use client';

interface StatsCardsProps {
  stats: {
    totalProducts: number;
    activeProducts: number;
    totalStock: number;
    totalSales: number;
    lowStockProducts: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: '📦',
      color: 'bg-blue-500',
    },
    {
      title: 'Active Products',
      value: stats.activeProducts,
      icon: '✅',
      color: 'bg-green-500',
    },
    {
      title: 'Total Stock',
      value: stats.totalStock,
      icon: '📊',
      color: 'bg-purple-500',
    },
    {
      title: 'Total Sales',
      value: stats.totalSales,
      icon: '💰',
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
            </div>
            <div className={`${card.color} rounded-full p-3 text-2xl`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

