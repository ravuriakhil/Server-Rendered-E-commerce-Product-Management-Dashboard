'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Package, Users, LogOut, Disc } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-text-primary">
        <div className="text-sm font-medium animate-pulse">Loading...</div>
      </div>
    );
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/dashboard/products', icon: Package },
    { name: 'Onboard Admin', href: '/admin/onboard', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-surface/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">

            {/* Logo area */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                  <Disc className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-text-primary tracking-tight">E-COMMERCE</span>
              </div>

              {/* Minimal Tabs Navigation */}
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`
                          group flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200
                          ${isActive
                            ? 'bg-surface-hover text-text-primary'
                            : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover/50'
                          }
                        `}
                      >
                        <item.icon className={`mr-2 h-4 w-4 ${isActive ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'} transition-colors`} />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* User & Logout */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-xs text-text-secondary">Signed in as</span>
                <span className="text-sm text-text-primary font-medium">{user?.email}</span>
              </div>
              <button
                onClick={() => logout()}
                className="p-2 text-text-secondary hover:text-danger hover:bg-surface-hover rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-danger/20"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-text-primary">
        {children}
      </main>
    </div>
  );
}

