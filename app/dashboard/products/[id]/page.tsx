import DashboardLayout from '@/components/DashboardLayout';
import ProductDetail from '@/components/ProductDetail';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { getCurrentUserFromCookies } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';

async function getProduct(id: string) {
  await connectDB();
  const product = await Product.findById(id).lean();
  if (!product) return null;
  return JSON.parse(JSON.stringify(product));
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const headersList = headers();
  const cookieHeader = headersList.get('cookie');
  
  const user = await getCurrentUserFromCookies(cookieHeader);

  if (!user) {
    redirect('/login');
  }

  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-0">
        <ProductDetail product={product} />
      </div>
    </DashboardLayout>
  );
}

