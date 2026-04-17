'use client';

import { RoleGuard } from '@/components/auth/RoleGuard';

export default function TechnicianLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['TECHNICIAN']}>
      {children}
    </RoleGuard>
  );
}
