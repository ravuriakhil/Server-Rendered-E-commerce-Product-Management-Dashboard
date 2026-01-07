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
          <h2 className="text-2xl font-bold text-text-primary">Edit Product</h2>
        </div>
        <div className="bg-surface border border-border rounded-lg shadow-sm p-6">
          <ProductForm
            product={product}
            onSuccess={() => setIsEditing(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="text-text-primary">
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text-primary">{product.name}</h2>
        <div className="space-x-4">
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="btn-danger"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          <div>
            {product.images && product.images.length > 0 ? (
              <div className="space-y-4">
                <div className="w-full h-96 bg-black/20 rounded-lg flex items-center justify-center border border-border overflow-hidden relative">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.slice(1).map((image, index) => (
                      <div key={index} className="relative h-24 bg-black/20 rounded-md border border-border overflow-hidden">
                        <Image
                          src={image}
                          alt={`${product.name} ${index + 2}`}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-96 bg-surface-hover rounded-lg flex items-center justify-center border border-border">
                <span className="text-text-secondary">No images</span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Description</h3>
              <p className="text-text-secondary">{product.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-text-secondary">Price</h4>
                <p className="text-2xl font-bold text-text-primary">₹{product.price.toFixed(2)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-text-secondary">Stock</h4>
                <p className="text-2xl font-bold text-text-primary">{product.stock}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-text-secondary">Category</h4>
                <p className="text-lg font-semibold text-text-primary">{product.category}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-text-secondary">SKU</h4>
                <p className="text-lg font-semibold text-text-primary">{product.sku}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-text-secondary">Status</h4>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${product.status === 'active'
                    ? 'bg-green-900/20 text-green-400 border-green-900/30'
                    : 'bg-red-900/20 text-red-400 border-red-900/30'
                    }`}
                >
                  {product.status}
                </span>
              </div>
              <div className="col-span-2">
                <h4 className="text-sm font-medium text-text-secondary mb-2">Sales</h4>
                <p className="text-2xl font-bold text-text-primary mb-3">{product.sales}</p>
                <div className="flex gap-2 flex-wrap">
                  <input
                    type="number"
                    min="0"
                    value={salesInput}
                    onChange={(e) => setSalesInput(e.target.value)}
                    placeholder="Amount"
                    className="input-field w-32"
                  />
                  <button
                    onClick={handleAddSales}
                    disabled={isUpdatingSales || !salesInput}
                    className="btn-primary bg-success hover:bg-success/80 ring-success disabled:opacity-50"
                  >
                    Add
                  </button>
                  <button
                    onClick={handleSetSales}
                    disabled={isUpdatingSales || !salesInput}
                    className="btn-primary disabled:opacity-50"
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

