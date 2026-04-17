'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function DashboardRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else {
        // Redirect to specific dashboard based on role
        switch (user.role) {
          case 'ADMIN':
            router.replace('/dashboard/admin');
            break;
          case 'TECHNICIAN':
            router.replace('/dashboard/technician');
            break;
          case 'CLIENT':
            router.replace('/dashboard/client');
            break;
          default:
            // If role is unknown, send to login to clear state or show error
            router.replace('/login');
        }
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
      <p className="text-gray-500 animate-pulse font-medium">Redirecting to your dashboard...</p>
    </div>
  );
}
