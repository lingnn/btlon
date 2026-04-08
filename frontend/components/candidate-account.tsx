'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/auth-store';
import { authAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function CandidateAccount() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const getAuthToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken') || localStorage.getItem('token');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthToken();

    if (!token) {
      toast.error('Không tìm thấy phiên đăng nhập');
      return;
    }

    setIsSavingProfile(true);
    try {
      const updated = await authAPI.updateMe(token, {
        fullName: profileForm.fullName,
        email: profileForm.email,
        phone: profileForm.phone,
        address: profileForm.address,
      });

      if (user && updated) {
        const nextUser = {
          id: updated._id || updated.id || user.id,
          username: updated.username || user.username,
          email: updated.email || profileForm.email || user.email,
          fullName: updated.fullName || profileForm.fullName || user.fullName,
          role: (updated.role || user.role) as 'candidate' | 'content_admin' | 'system_admin',
          phone: updated.phone || profileForm.phone || user.phone,
        };
        setUser(nextUser);
      }

      toast.success('Cập nhật thông tin cá nhân thành công');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Cập nhật thông tin thất bại');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      toast.error('Xác nhận mật khẩu mới không khớp');
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(passwordForm.newPassword)) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự, gồm cả chữ và số');
      return;
    }

    const token = getAuthToken();
    if (!token) {
      toast.error('Không tìm thấy phiên đăng nhập');
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await authAPI.changePassword(token, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success(response.message || 'Đổi mật khẩu thành công');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Đổi mật khẩu thất bại');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold text-[#b31f24]">Tài Khoản &amp; Bảo Mật</h1>
            <p className="text-sm text-muted-foreground">Quản lý thông tin cá nhân và mật khẩu của bạn</p>
          </div>
          <Button variant="outline" onClick={() => router.push('/candidate/portal')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại cổng thí sinh
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-[#b31f24]" />
                Thông tin cá nhân
              </CardTitle>
              <CardDescription>Cập nhật thông tin liên hệ để hệ thống gửi thông báo chính xác.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Họ và tên</Label>
                  <Input
                    id="fullName"
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, fullName: e.target.value }))}
                    required
                    disabled={isSavingProfile}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))}
                    required
                    disabled={isSavingProfile}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="Nhập số điện thoại"
                    disabled={isSavingProfile}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Input
                    id="address"
                    value={profileForm.address}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, address: e.target.value }))}
                    placeholder="Nhập địa chỉ"
                    disabled={isSavingProfile}
                  />
                </div>

                <Button type="submit" className="w-full bg-[#b31f24] hover:bg-[#8f191d]" disabled={isSavingProfile}>
                  {isSavingProfile ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#b31f24]" />
                Đổi mật khẩu
              </CardTitle>
              <CardDescription>Mật khẩu mới phải có ít nhất 6 ký tự, gồm cả chữ và số.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                    required
                    disabled={isChangingPassword}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="newPassword">Mật khẩu mới</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                    minLength={6}
                    pattern="(?=.*[A-Za-z])(?=.*\d).{6,}"
                    title="Mật khẩu mới phải có ít nhất 6 ký tự, gồm cả chữ và số"
                    required
                    disabled={isChangingPassword}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirmNewPassword">Xác nhận mật khẩu mới</Label>
                  <Input
                    id="confirmNewPassword"
                    type="password"
                    value={passwordForm.confirmNewPassword}
                    onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmNewPassword: e.target.value }))}
                    required
                    disabled={isChangingPassword}
                  />
                </div>

                <Button type="submit" className="w-full bg-[#b31f24] hover:bg-[#8f191d]" disabled={isChangingPassword}>
                  {isChangingPassword ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
