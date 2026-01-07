'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductFormData } from '@/lib/validations/product';
import { useCreateProduct, useUpdateProduct, Product } from '@/hooks/useProducts';
import ImageUpload from './ImageUpload';
import { useRouter } from 'next/navigation';

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
}

const steps = [
  { id: 1, name: 'Basic Information', fields: ['name', 'description', 'category'] },
  { id: 2, name: 'Pricing & Inventory', fields: ['price', 'stock', 'sku'] },
  { id: 3, name: 'Images & Status', fields: ['images', 'status'] },
];

export default function ProductForm({ product, onSuccess }: ProductFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    trigger,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock,
        sku: product.sku,
        status: product.status,
        images: product.images || [],
        sales: product.sales || 0,
      }
      : {
        status: 'active',
        images: [],
        sales: 0,
      },
  });

  const images = watch('images') || [];

  const handleImageUpload = (url: string) => {
    const currentImages = images || [];
    setValue('images', [...currentImages, url]);
  };

  const removeImage = (index: number) => {
    const currentImages = images || [];
    setValue('images', currentImages.filter((_, i) => i !== index));
  };

  const nextStep = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    e?.stopPropagation();

    const fields = steps[currentStep - 1].fields;
    const isValid = await trigger(fields as any);

    if (isValid) {
      setCurrentStep((step) => Math.min(step + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep((step) => Math.max(step - 1, 1));
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (product) {
        await updateProduct.mutateAsync({ id: product._id, data });
      } else {
        await createProduct.mutateAsync(data);
      }
      onSuccess?.();
      router.push('/dashboard/products');
    } catch (error) {
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="mb-8">
        <div className="flex space-x-8 border-b border-border mb-8">
          {steps.map((step) => (
            <button
              key={step.id}
              type="button"
              onClick={() => {
              }}
              className={`pb-4 text-sm font-medium border-b-2 transition-colors ${currentStep === step.id
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
            >
              {step.name}
            </button>
          ))}
        </div>
      </div>

      {currentStep === 1 && (
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">
              Product Name *
            </label>
            <input
              {...register('name')}
              type="text"
              className="input-field max-w-md"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="input-field max-w-md"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-text-secondary mb-1">
              Category *
            </label>
            <input
              {...register('category')}
              type="text"
              className="input-field max-w-md"
            />
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-text-secondary mb-1">
              Price (₹) *
            </label>
            <input
              {...register('price', { valueAsNumber: true })}
              type="number"
              className="input-field max-w-md"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-text-secondary mb-1">
              Stock Quantity *
            </label>
            <input
              {...register('stock', { valueAsNumber: true })}
              type="number"
              className="input-field max-w-md"
            />
            {errors.stock && (
              <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-text-secondary mb-1">
              SKU (Stock Keeping Unit) *
            </label>
            <input
              {...register('sku')}
              type="text"
              className="input-field max-w-md"
            />
            {errors.sku && (
              <p className="mt-1 text-sm text-red-600">{errors.sku.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="sales" className="block text-sm font-medium text-text-secondary mb-1">
              Sales (Total units sold)
            </label>
            <input
              {...register('sales', { valueAsNumber: true })}
              type="number"
              className="input-field max-w-md"
            />
            {errors.sales && (
              <p className="mt-1 text-sm text-red-600">{errors.sales.message}</p>
            )}
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Product Images
            </label>
            <ImageUpload onUpload={handleImageUpload} />
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                {images.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            {errors.images && (
              <p className="mt-1 text-sm text-red-600">{errors.images.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-text-secondary mb-1">
              Status *
            </label>
            <select
              {...register('status')}
              className="input-field max-w-md"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {currentStep < steps.length ? (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              nextStep(e);
            }}
            className="btn-primary"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
          </button>
        )}
      </div>
    </form>
  );
}

