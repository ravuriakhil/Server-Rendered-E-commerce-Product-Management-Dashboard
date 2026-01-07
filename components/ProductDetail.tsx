'use client';

import { useState, useEffect } from 'react';
import { useDeleteProduct, useUpdateProduct, Product } from '@/hooks/useProducts';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductForm from '@/components/ProductForm';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const searchParams = useSearchParams();
  const [isEditing, setIsEditing] = useState(searchParams.get('edit') === 'true');
  const [salesInput, setSalesInput] = useState('');
  const [isUpdatingSales, setIsUpdatingSales] = useState(false);
  const deleteProduct = useDeleteProduct();
  const updateProduct = useUpdateProduct();
  const router = useRouter();

  useEffect(() => {
    // Update editing state if query param changes
    if (searchParams.get('edit') === 'true' && !isEditing) {
      setIsEditing(true);
    }
  }, [searchParams, isEditing]);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProduct.mutateAsync(product._id);
      router.push('/dashboard/products');
    }
  };

  const handleAddSales = async () => {
    const salesToAdd = parseInt(salesInput);
    if (isNaN(salesToAdd) || salesToAdd <= 0) {
      toast.error('Please enter a valid positive number');
      return;
    }

    setIsUpdatingSales(true);
    try {
      await updateProduct.mutateAsync({
        id: product._id,
        data: { sales: product.sales + salesToAdd },
      });
      setSalesInput('');
      toast.success(`Added ${salesToAdd} sales successfully`);
    } catch (error) {
      toast.error('Failed to update sales');
    } finally {
      setIsUpdatingSales(false);
    }
  };

  const handleSetSales = async () => {
    const newSales = parseInt(salesInput);
    if (isNaN(newSales) || newSales < 0) {
      toast.error('Please enter a valid non-negative number');
      return;
    }

    setIsUpdatingSales(true);
    try {
      await updateProduct.mutateAsync({
        id: product._id,
        data: { sales: newSales },
      });
      setSalesInput('');
      toast.success('Sales updated successfully');
    } catch (error) {
      toast.error('Failed to update sales');
    } finally {
      setIsUpdatingSales(false);
    }
  };

  if (isEditing) {
    return (
      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <ProductForm
            product={product}
            onSuccess={() => setIsEditing(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
        <div className="space-x-4">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          <div>
            {product.images && product.images.length > 0 ? (
              <div className="space-y-4">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={600}
                  height={400}
                  className="w-full h-96 object-cover rounded-lg"
                />
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.slice(1).map((image, index) => (
                      <Image
                        key={index}
                        src={image}
                        alt={`${product.name} ${index + 2}`}
                        width={150}
                        height={150}
                        className="w-full h-24 object-cover rounded-md"
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">No images</span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Price</h4>
                <p className="text-2xl font-bold text-gray-900">₹{product.price.toFixed(2)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Stock</h4>
                <p className="text-2xl font-bold text-gray-900">{product.stock}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Category</h4>
                <p className="text-lg font-semibold text-gray-900">{product.category}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">SKU</h4>
                <p className="text-lg font-semibold text-gray-900">{product.sku}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Status</h4>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    product.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {product.status}
                </span>
              </div>
              <div className="col-span-2">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Sales</h4>
                <p className="text-2xl font-bold text-gray-900 mb-3">{product.sales}</p>
                <div className="flex gap-2 flex-wrap">
                  <input
                    type="number"
                    min="0"
                    value={salesInput}
                    onChange={(e) => setSalesInput(e.target.value)}
                    placeholder="Enter amount"
                    className="w-32 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleAddSales}
                    disabled={isUpdatingSales || !salesInput}
                    className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                  <button
                    onClick={handleSetSales}
                    disabled={isUpdatingSales || !salesInput}
                    className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Set
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

