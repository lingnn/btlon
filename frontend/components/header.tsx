"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, LogOut, User, Menu, X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { label: "Trang Chủ", href: "/" },
    { label: "Về Chúng Tôi", href: "/about" },
    { label: "Tin Tức", href: "#" },
    { label: "Tra Cứu Kết Quả", href: "#" },
    { label: "Hướng Dẫn Tuyển Sinh", href: "https://tuyensinh.ptit.edu.vn/brochure-ptit-2025-2/", external: true },
  ]

  const handleLogout = () => {
    logout()
    toast.success("Đăng xuất thành công")
    router.push("/")
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-gray-900">PTIT</div>
              <div className="text-xs text-gray-500">Cổng Tuyển Sinh</div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="px-3 py-2 text-sm text-gray-700 hover:text-red-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="hidden sm:flex border-gray-300 text-gray-700 gap-2">
                    <User className="w-4 h-4" />
                    {user?.fullName || user?.username}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Hồ sơ cá nhân
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4" />
                        Quản trị viên
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="outline" 
                className="hidden sm:flex border-gray-300 text-gray-700"
                asChild
              >
                <Link href="/login">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Đăng Nhập / Đăng Kí
                </Link>
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="px-3 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <Link
                  href="/login"
                  className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Đăng Nhập / Đăng Kí
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
