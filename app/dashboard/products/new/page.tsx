import DashboardLayout from '@/components/DashboardLayout';
import ProductForm from '@/components/ProductForm';
import { getCurrentUserFromCookies } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function NewProductPage() {
  const headersList = headers();
  const cookieHeader = headersList.get('cookie');
  
  const user = await getCurrentUserFromCookies(cookieHeader);

  if (!user) {
    redirect('/login');
  }

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Create New Product</h2>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <ProductForm />
        </div>
      </div>
    </DashboardLayout>
  );
}

