import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  stock: z.number().min(0, 'Stock must be positive'),
  sku: z.string().min(1, 'SKU is required'),
  status: z.enum(['active', 'inactive']),
  images: z.array(z.string().url('Invalid image URL')).optional().default([]),
  sales: z.number().min(0, 'Sales must be positive').optional().default(0),
});

export type ProductFormData = z.infer<typeof productSchema>;

