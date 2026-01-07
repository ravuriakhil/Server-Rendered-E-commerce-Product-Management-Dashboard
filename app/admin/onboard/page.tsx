import DashboardLayout from '@/components/DashboardLayout';
import AdminOnboardForm from '@/components/AdminOnboardForm';
import { getCurrentUserFromCookies } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminOnboardPage() {
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
          <h2 className="text-2xl font-bold text-gray-900">Onboard New Admin</h2>
          <p className="mt-2 text-sm text-gray-600">
            Create a new admin account.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
          <AdminOnboardForm />
        </div>
      </div>
    </DashboardLayout>
  );
}

