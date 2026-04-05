"use client";

import { useState } from "react";
import { Save, Bell, Lock, Globe } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { authAPI } from "@/lib/api";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "PTIT - Cổng Tuyển Sinh",
    contactEmail: "tuyensinh@ptit.edu.vn",
    contactPhone: "(024) 3854 0095",
    emailNotifications: true,
    smsNotifications: false,
    autoApprove: false,
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleSave = () => {
    toast.success("Lưu cài đặt thành công");
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      toast.error("Xác nhận mật khẩu mới không khớp");
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(passwordForm.newPassword)) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự, gồm cả chữ và số");
      return;
    }

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("authToken") || localStorage.getItem("token")
        : null;

    if (!token) {
      toast.error("Không tìm thấy phiên đăng nhập");
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await authAPI.changePassword(token, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success(response.message || "Đổi mật khẩu thành công");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Đổi mật khẩu thất bại");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cài đặt</h1>
        <p className="text-gray-500">Quản lý cài đặt hệ thống</p>
      </div>

      {/* General Settings */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-red-600" />
            Cài đặt chung
          </CardTitle>
          <CardDescription>Thông tin cơ bản của hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="siteName">Tên website</FieldLabel>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="contactEmail">Email liên hệ</FieldLabel>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="contactPhone">Số điện thoại</FieldLabel>
              <Input
                id="contactPhone"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-600" />
            Thông báo
          </CardTitle>
          <CardDescription>Cài đặt thông báo hệ thống</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Thông báo qua Email</p>
              <p className="text-sm text-gray-500">Gửi email khi có hồ sơ mới</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, emailNotifications: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Thông báo qua SMS</p>
              <p className="text-sm text-gray-500">Gửi SMS cho thí sinh khi có cập nhật</p>
            </div>
            <Switch
              checked={settings.smsNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, smsNotifications: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-600" />
            Bảo mật
          </CardTitle>
          <CardDescription>Cài đặt bảo mật và quyền truy cập</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Tự động duyệt hồ sơ</p>
              <p className="text-sm text-gray-500">Tự động duyệt hồ sơ hợp lệ</p>
            </div>
            <Switch
              checked={settings.autoApprove}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, autoApprove: checked })
              }
            />
          </div>

          <Separator />

          <form onSubmit={handlePasswordChange} className="space-y-3">
            <p className="font-medium">Đổi mật khẩu</p>
            <Input
              type="password"
              placeholder="Mật khẩu hiện tại"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
              }
              disabled={isChangingPassword}
              required
            />
            <Input
              type="password"
              placeholder="Mật khẩu mới (ít nhất 6 ký tự, gồm chữ và số)"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, newPassword: e.target.value })
              }
              minLength={6}
              pattern="(?=.*[A-Za-z])(?=.*\d).{6,}"
              title="Mật khẩu mới phải có ít nhất 6 ký tự, gồm cả chữ và số"
              disabled={isChangingPassword}
              required
            />
            <Input
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              value={passwordForm.confirmNewPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })
              }
              disabled={isChangingPassword}
              required
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700"
                disabled={isChangingPassword}
              >
                {isChangingPassword ? "Đang cập nhật..." : "Đổi mật khẩu"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-red-600 hover:bg-red-700" onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Lưu cài đặt
        </Button>
      </div>
    </div>
  );
}
