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
          <h2 className="text-2xl font-bold text-text-primary">All Products</h2>
          <Link
            href="/dashboard/products/new"
            className="btn-primary"
          >
            Create New Product
          </Link>
        </div>

        <div className="bg-surface border border-border rounded-lg shadow-sm p-6">
          <ProductList />
        </div>
      </div>
    </DashboardLayout>
  );
}

