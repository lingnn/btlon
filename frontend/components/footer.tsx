import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#b31f24]">
                <span className="text-lg font-bold text-white">P</span>
              </div>
              <div className="flex flex-col">
              <span className="text-sm font-bold text-[#b31f24]">PTIT</span>
              <span className="text-xs text-muted-foreground">
                Cổng Tuyển Sinh
              </span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">

              Học viện Công nghệ Bưu chính Viễn thông - Nơi khởi đầu cho tương lai của bạn!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Liên Kết Nhanh</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground transition-colors hover:text-[#b31f24]"
                >
                  Về Chúng Tôi
                </Link>
              </li>
              <li>
                <Link
                  href="/programs"
                  className="text-sm text-muted-foreground transition-colors hover:text-[#b31f24]"
                >
                  Chương Trình
                </Link>
              </li>
              <li>
                <Link
                  href="/schemes"
                  className="text-sm text-muted-foreground transition-colors hover:text-[#b31f24]"
                >
                  Hướng Dẫn Tuyển Sinh
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-muted-foreground transition-colors hover:text-[#b31f24]"
                >
                  Câu Hỏi Thường Gặp
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Liên Hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#b31f24]" />
                <span>Km10, Nguyễn Trãi, Hà Đông, Hà Nội</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0 text-[#b31f24]" />
                <span>(024) 3854 0095</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0 text-[#b31f24]" />
                <span>tuyensinh@ptit.edu.vn</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Theo Dõi Chúng Tôi</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-[#b31f24] hover:text-white"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-[#b31f24] hover:text-white"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Cổng Tuyển Sinh PTIT. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
