"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Search, LogIn, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth-modal";
import { useAuthStore } from "@/lib/auth-store";

const navItems = [
  { label: "Trang Chủ", href: "/" },
  { label: "Về Chúng Tôi", href: "/about" },
  { label: "Thông Báo", href: "/announcements" },
  { label: "Tin Tức", href: "/news" },
  { label: "Hướng Dẫn Tuyển Sinh", href: "https://tuyensinh.ptit.edu.vn/brochure-ptit-2025-2/", external: true },
];

export function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleApplyClick = () => {
    if (!user) {
      setAuthModalOpen(true);
    } else if (user.role === "candidate") {
      router.push("/candidate/portal");
    } else if (user.role === "content_admin" || user.role === "system_admin") {
      router.push("/admin");
    }
  };

  if (!mounted) return null;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#b31f24]">
              <span className="text-lg font-bold text-white">P</span>
            </div>
            <div className="hidden flex-col sm:flex">
              <span className="text-sm font-bold text-[#b31f24]">PTIT</span>
              <span className="text-xs text-muted-foreground">
                Cổng Tuyển Sinh
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden rounded-full border border-border/30 bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 sm:inline-flex">
                  Xin chào, {user.fullName || user.username}
                </span>

                {(user.role === "content_admin" || user.role === "system_admin") && (
                  <Button
                    className="hidden gap-2 bg-blue-600 hover:bg-blue-700 sm:flex"
                    asChild
                  >
                    <Link href="/admin">
                      <LayoutDashboard className="h-4 w-4" />
                      Admin Panel
                    </Link>
                  </Button>
                )}

                {user.role === "candidate" && (
                  <Button
                    onClick={() => router.push("/candidate/portal")}
                    className="hidden bg-[#b31f24] text-white hover:bg-[#8f191d] sm:inline-flex"
                  >
                    Nộp Hồ Sơ Online
                  </Button>
                )}

                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="hidden gap-2 sm:flex"
                >
                  <LogOut className="h-4 w-4" />
                  Đăng Xuất
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => setAuthModalOpen(true)}
                  variant="outline"
                  className="hidden gap-2 sm:flex"
                >
                  <LogIn className="h-4 w-4" />
                  Đăng Nhập / Đăng Kí
                </Button>

                <Button
                  className="hidden bg-[#b31f24] text-white hover:bg-[#8f191d] sm:inline-flex"
                  onClick={handleApplyClick}
                >
                  Nộp Hồ Sơ Online
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              className="rounded-md p-2 lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Mở menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t bg-white lg:hidden">
            <nav className="container mx-auto flex flex-col px-4 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-2 rounded-md px-3 py-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </Link>
              ))}
              {user ? (
                <>
                  {(user.role === "content_admin" || user.role === "system_admin") && (
                    <Button
                      className="mt-3 w-full gap-2 bg-blue-600 hover:bg-blue-700"
                      asChild
                    >
                      <Link href="/admin">
                        <LayoutDashboard className="h-4 w-4" />
                        Admin Panel
                      </Link>
                    </Button>
                  )}
                  
                  {user.role === "candidate" && (
                    <Button
                      className="mt-3 w-full bg-[#b31f24] hover:bg-[#8f191d]"
                      onClick={() => {
                        router.push("/candidate/portal");
                        setMobileMenuOpen(false);
                      }}
                    >
                      Nộp Hồ Sơ Online
                    </Button>
                  )}

                  <Button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    variant="outline"
                    className="mt-3 w-full gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Đăng Xuất
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      setAuthModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    variant="outline"
                    className="mt-3 w-full"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Đăng Nhập / Đăng Kí
                  </Button>
                  <Button
                    onClick={() => {
                      handleApplyClick();
                      setMobileMenuOpen(false);
                    }}
                    className="mt-3 w-full bg-[#b31f24] text-white hover:bg-[#8f191d]"
                  >
                    Nộp Hồ Sơ Online
                  </Button>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
