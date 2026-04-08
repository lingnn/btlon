'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'candidate' | 'content_admin' | 'system_admin';
  requiredRoles?: Array<'candidate' | 'content_admin' | 'system_admin'>;
}

export function ProtectedRoute({ children, requiredRole, requiredRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token } = useAuthStore();

  const currentRole = user?.role ?? null;
  const allowedRoles = requiredRoles
    ? requiredRoles
    : requiredRole
      ? [requiredRole]
      : [];

  useEffect(() => {
    if (!token || !user) {
      router.push(`/login?redirect=${pathname}`);
      return;
    }

    if (allowedRoles.length > 0 && currentRole && !allowedRoles.includes(currentRole)) {
      router.push('/unauthorized');
      return;
    }
  }, [user, token, allowedRoles, currentRole, pathname, router]);

  if (!token || !user) {
    return <div>Đang tải...</div>;
  }

  if (allowedRoles.length > 0 && currentRole && !allowedRoles.includes(currentRole)) {
    return <div>Bạn không có quyền truy cập trang này</div>;
  }

  return <>{children}</>;
}
