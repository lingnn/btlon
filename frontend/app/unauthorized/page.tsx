'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl">Truy Cập Bị Từ Chối</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Bạn không có quyền truy cập trang này. Vui lòng đăng nhập bằng tài khoản có quyền thích hợp.
          </p>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/login">Đăng Nhập</Link>
            </Button>
            <Button className="flex-1 bg-[#b31f24] hover:bg-[#8f191d]" asChild>
              <Link href="/">Trang Chủ</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
