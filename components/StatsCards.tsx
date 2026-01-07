'use client';

import { Package, Archive, TrendingUp, AlertCircle } from 'lucide-react';

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
      icon: Package,
    },
    {
      title: 'Active Products',
      value: stats.activeProducts,
      icon: Archive,
    },
    {
      title: 'Total Stock',
      value: stats.totalStock,
      icon: TrendingUp,
    },
    {
      title: 'Total Sales',
      value: stats.totalSales,
      icon: AlertCircle,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-surface border border-border rounded-lg p-6 hover:bg-surface-hover/50 transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">{card.title}</p>
              <p className="text-2xl font-semibold text-text-primary mt-2">{card.value}</p>
            </div>
            <div className={`p-2 rounded-md bg-surface border border-border`}>
              <card.icon className="h-5 w-5 text-text-secondary" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

