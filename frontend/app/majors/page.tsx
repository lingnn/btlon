'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/lib/auth-store';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

interface Major {
  _id?: string;
  id?: string;
  code: string;
  name: string;
  totalQuota: number;
  duration: number;
  year: number;
  description?: string;
}

export default function MajorsPage() {
  const { user, token } = useAuthStore();
  const [activeManageId, setActiveManageId] = useState<string | null>(null);
  const [editingMajor, setEditingMajor] = useState<Major | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    code: '',
    totalQuota: 0,
    duration: 0,
    year: new Date().getFullYear(),
    description: '',
  });

  const isAdmin = user?.role === 'admin';

  const fetcher = async (): Promise<Major[]> => {
    const res = await api.major.getAll();
    // Backend currently returns `Major[]`, but some frontend code expects `{ data: Major[] }`.
    if (Array.isArray(res)) return res as Major[];
    if (res && typeof res === 'object' && 'data' in (res as any) && Array.isArray((res as any).data)) {
      return (res as any).data as Major[];
    }
    return [];
  };

  const {
    data,
    error,
    isLoading,
    mutate,
  } = useSWR<Major[]>('/majors', fetcher, {
    refreshInterval: 5000,
  });

  useEffect(() => {
    if (!editingMajor) return;
    setEditForm({
      name: editingMajor.name ?? '',
      code: editingMajor.code ?? '',
      totalQuota: Number(editingMajor.totalQuota ?? 0),
      duration: Number(editingMajor.duration ?? 0),
      year: Number(editingMajor.year ?? new Date().getFullYear()),
      description: editingMajor.description ?? '',
    });
  }, [editingMajor]);

  const getAuthToken = (): string | null => {
    if (token) return token;
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken') || localStorage.getItem('token');
  };

  const handleDelete = async (major: Major) => {
    const majorId = major._id ?? major.id;
    if (!majorId) {
      toast.error('Không tìm thấy ID ngành để xóa.');
      return;
    }

    const confirmed = window.confirm(`Bạn có chắc muốn xóa ngành "${major.name}" không?`);
    if (!confirmed) return;

    const authToken = getAuthToken();
    if (!authToken) {
      toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.major.delete(authToken, majorId);
      toast.success('Đã xóa ngành đào tạo.');
      setActiveManageId(null);
      await mutate();
    } catch (err: any) {
      toast.error(err?.message || 'Xóa ngành thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingMajor) return;
    const majorId = editingMajor._id ?? editingMajor.id;
    if (!majorId) {
      toast.error('Không tìm thấy ID ngành để cập nhật.');
      return;
    }

    if (!editForm.name || !editForm.code || !editForm.totalQuota || !editForm.duration || !editForm.year) {
      toast.error('Vui lòng nhập đầy đủ các trường bắt buộc.');
      return;
    }

    const authToken = getAuthToken();
    if (!authToken) {
      toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        name: editForm.name,
        code: editForm.code,
        totalQuota: Number(editForm.totalQuota),
        duration: Number(editForm.duration),
        year: Number(editForm.year),
        description: editForm.description,
      } as any;
      await api.major.update(authToken, majorId, payload);
      toast.success('Cập nhật ngành thành công.');
      setEditingMajor(null);
      setActiveManageId(null);
      await mutate();
    } catch (err: any) {
      toast.error(err?.message || 'Cập nhật ngành thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const majors = data ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section
          className="relative text-white py-24 md:py-32 overflow-hidden"
          style={{
            backgroundImage: 'url(/images/about-hero.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-800/90 to-red-900/80"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-6">
              <Link href="/" className="hover:text-red-200 transition-colors flex items-center gap-1">
                <span>🏠</span>
                <span>Giới thiệu</span>
              </Link>
              <span>›</span>
              <span>Ngành đào tạo</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Danh sách ngành đào tạo</h1>
            <p className="text-red-100 text-lg max-w-2xl">
              Khám phá các ngành đào tạo, chỉ tiêu tuyển sinh và thông tin chương trình học tại PTIT.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {error ? (
              <Alert variant="destructive" className="max-w-3xl mx-auto">
                <AlertTitle>Không tải được danh sách ngành</AlertTitle>
                <AlertDescription>Vui lòng thử lại sau.</AlertDescription>
              </Alert>
            ) : isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <Card key={idx} className="shadow-lg">
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-3/5" />
                        <Skeleton className="h-4 w-2/5" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : majors.length === 0 ? (
              <Alert className="max-w-3xl mx-auto">
                <AlertTitle>Chưa có ngành đào tạo</AlertTitle>
                <AlertDescription>Hiện tại danh sách đang trống. Vui lòng quay lại sau.</AlertDescription>
              </Alert>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {majors.map((major) => (
                  <Card
                    key={major._id ?? major.id ?? major.code}
                    className="shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-xl">{major.name}</CardTitle>
                        {isAdmin && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setActiveManageId((prev) =>
                                prev === (major._id ?? major.id ?? major.code)
                                  ? null
                                  : (major._id ?? major.id ?? major.code)
                              )
                            }
                          >
                            Quản lý
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p>
                          <strong>Mã ngành:</strong> {major.code}
                        </p>
                        <p>
                          <strong>Tổng chỉ tiêu:</strong> {major.totalQuota}
                        </p>
                        <p>
                          <strong>Năm tuyển sinh:</strong> {major.year}
                        </p>
                        <p>
                          <strong>Thời gian học:</strong> {major.duration} năm
                        </p>
                        {isAdmin && activeManageId === (major._id ?? major.id ?? major.code) && (
                          <div className="flex gap-2 pt-3">
                            <Button
                              size="sm"
                              onClick={() => setEditingMajor(major)}
                              disabled={isSubmitting}
                            >
                              Sửa
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(major)}
                              disabled={isSubmitting}
                            >
                              Xóa
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      <Dialog open={Boolean(editingMajor)} onOpenChange={(open) => !open && setEditingMajor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sửa ngành đào tạo</DialogTitle>
            <DialogDescription>Cập nhật thông tin ngành rồi bấm Lưu thay đổi.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="major-name">Tên ngành</Label>
              <Input
                id="major-name"
                value={editForm.name}
                onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="major-code">Mã ngành</Label>
              <Input
                id="major-code"
                value={editForm.code}
                onChange={(e) => setEditForm((prev) => ({ ...prev, code: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="major-quota">Chỉ tiêu</Label>
                <Input
                  id="major-quota"
                  type="number"
                  min={0}
                  value={editForm.totalQuota}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, totalQuota: Number(e.target.value || 0) }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="major-duration">Thời gian học</Label>
                <Input
                  id="major-duration"
                  type="number"
                  min={0}
                  value={editForm.duration}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, duration: Number(e.target.value || 0) }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="major-year">Năm</Label>
                <Input
                  id="major-year"
                  type="number"
                  min={2000}
                  value={editForm.year}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, year: Number(e.target.value || 0) }))
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingMajor(null)} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button onClick={handleUpdate} disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}