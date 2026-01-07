'use client';

import { useProducts, useDeleteProduct } from '@/hooks/useProducts';
import { useState } from 'react';
import Link from 'next/link';
import { Eye, FileEdit, Trash2 } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  status: string;
  category: string;
}

interface ProductListProps {
  initialProducts?: Product[];
}

export default function ProductList({ initialProducts = [] }: ProductListProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useProducts(page, 10, search);
  const deleteProduct = useDeleteProduct();

  const products = data?.products || initialProducts;

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteProduct.mutateAsync(id);
      } catch (error) {
        // Error is handled by the mutation
      }
    }
  };

  return (
    <div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="input-field max-w-md"
        />
      </div>

      {isLoading && !initialProducts.length ? (
        <div className="text-center py-8 text-text-secondary">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-8 text-text-secondary">No products found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-surface-hover/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-border">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-surface-hover/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    ₹{product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full border ${product.status === 'active'
                        ? 'bg-green-900/20 text-green-400 border-green-900/30'
                        : 'bg-red-900/20 text-red-400 border-red-900/30'
                        }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <Link
                        href={`/dashboard/products/${product._id}`}
                        className="text-text-secondary hover:text-primary transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/dashboard/products/${product._id}?edit=true`}
                        className="text-text-secondary hover:text-primary transition-colors"
                        title="Edit"
                      >
                        <FileEdit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id, product.name)}
                        disabled={deleteProduct.isPending}
                        className="text-text-secondary hover:text-danger disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Delete"
                      >
                        {deleteProduct.isPending ? '...' : <Trash2 className="h-4 w-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data?.pagination && data.pagination.pages > 1 && (
        <div className="mt-4 flex justify-center space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-border rounded-md text-text-primary disabled:opacity-50 hover:bg-surface-hover"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-text-secondary">
            Page {data.pagination.page} of {data.pagination.pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(data.pagination.pages, p + 1))}
            disabled={page === data.pagination.pages}
            className="px-4 py-2 border border-border rounded-md text-text-primary disabled:opacity-50 hover:bg-surface-hover"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

