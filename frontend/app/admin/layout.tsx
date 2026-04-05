"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  LogOut,
  ChevronRight,
  Home,
  Cog,
  BookOpen,
  Bell,
  Users
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { label: "Tổng quan", href: "/admin", icon: LayoutDashboard },
  { label: "Quản lý hồ sơ", href: "/admin/applications", icon: FileText },
  { label: "Quản lý thông báo", href: "/admin/announcements", icon: Bell },
  { label: "Quản lý người dùng", href: "/admin/users", icon: Users },
  { label: "Quản lý ngành học", href: "/admin/majors", icon: BookOpen },
  { label: "Quản lý phương thức", href: "/admin/methods", icon: Cog },
  { label: "Cài đặt", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "admin") {
      if (!isAuthenticated) {
        toast.error("Vui lòng đăng nhập");
      } else if (user?.role !== "admin") {
        toast.error("Bạn không có quyền truy cập trang này");
      }
      router.push("/login");
    }
  }, [isAuthenticated, user, router]);

  const handleLogout = () => {
    logout();
    toast.success("Đăng xuất thành công");
    router.push("/");
  };

  if (!isAuthenticated || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-200">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <div>
              <div className="font-bold text-gray-900">PTIT Admin</div>
              <div className="text-xs text-gray-500">Quản trị hệ thống</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-red-50 text-red-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/">
                <Home className="w-4 h-4 mr-3" />
                Về trang chủ
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
