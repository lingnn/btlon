'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'candidate';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token } = useAuthStore();

  useEffect(() => {
    if (!token || !user) {
      router.push(`/login?redirect=${pathname}`);
      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      router.push('/unauthorized');
      return;
    }
  }, [user, token, requiredRole, pathname, router]);

  if (!token || !user) {
    return <div>Đang tải...</div>;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <div>Bạn không có quyền truy cập trang này</div>;
  }

  return <>{children}</>;
}
