'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { authAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';

export function RegisterForm() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    phone: '',
    idNumber: '',
    password: '',
    confirmPassword: '',
    role: 'candidate' as const,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('Mật khẩu phải có ít nhất 6 ký tự, gồm cả chữ và số');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.register({
        username: formData.username,
        email: formData.email,
        fullName: formData.fullName,
        phone: formData.phone,
        idNumber: formData.idNumber,
        password: formData.password,
        role: formData.role,
      });

      // Redirect to login page after successful registration
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng kí thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#b31f24]">
              <span className="text-xl font-bold text-white">P</span>
            </div>
          </div>
          <CardTitle className="text-center text-2xl">Đăng Kí</CardTitle>
          <CardDescription className="text-center">
            Tạo tài khoản để bắt đầu nộp hồ sơ
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Tên Đăng Nhập</label>
              <Input
                type="text"
                name="username"
                placeholder="Nhập tên đăng nhập"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Họ và Tên</label>
              <Input
                type="text"
                name="fullName"
                placeholder="Nhập họ và tên"
                value={formData.fullName}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                name="email"
                placeholder="Nhập email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Số Điện Thoại</label>
              <Input
                type="tel"
                name="phone"
                placeholder="Nhập số điện thoại"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Căn Cước Công Dân (CCCD)</label>
              <Input
                type="text"
                name="idNumber"
                placeholder="Nhập số CCCD (12 chữ số)"
                value={formData.idNumber}
                onChange={handleChange}
                pattern="\d{12}"
                maxLength={12}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mật Khẩu</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Tối thiểu 6 ký tự, gồm chữ và số"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={6}
                  pattern="(?=.*[A-Za-z])(?=.*\d).{6,}"
                  title="Mật khẩu phải có ít nhất 6 ký tự, gồm cả chữ và số"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Xác Nhận Mật Khẩu</label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Nhập lại mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#b31f24] hover:bg-[#8f191d]"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Đăng Kí
            </Button>

            <div className="text-center text-sm">
              Đã có tài khoản?{' '}
              <Link href="/login" className="font-medium text-[#b31f24] hover:underline">
                Đăng Nhập
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
