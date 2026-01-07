import DashboardLayout from '@/components/DashboardLayout';
import ProductList from '@/components/ProductList';
import Link from 'next/link';
import { getCurrentUserFromCookies } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function ProductsPage() {
  const headersList = headers();
  const cookieHeader = headersList.get('cookie');
  
  const user = await getCurrentUserFromCookies(cookieHeader);

  if (!user) {
    redirect('/login');
  }

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">All Products</h2>
          <Link
            href="/dashboard/products/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            Create New Product
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <ProductList />
        </div>
      </div>
    </DashboardLayout>
  );
}

