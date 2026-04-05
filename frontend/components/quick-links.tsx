import Link from "next/link";
import { BookOpen, FileText, Send } from "lucide-react";

const quickLinks = [
  {
    title: "Hướng Dẫn Tuyển Sinh",
    description: "Mở file PDF chi tiết tuyển sinh",
    icon: BookOpen,
    href: "https://tuyensinh.ptit.edu.vn/brochure-ptit-2025-2/",
    color: "bg-amber-500",
    external: true,
  },
  {
    title: "Hướng Dẫn Đăng Kí",
    description: "Hướng dẫn từng bước",
    icon: FileText,
    href: "/guide",
    color: "bg-emerald-500",
  },
  {
    title: "Nộp Hồ Sơ",
    description: "Bắt đầu đơn xin của bạn",
    icon: Send,
    href: "/submit",
    color: "bg-blue-500",
  },
];

export function QuickLinks() {
  return (
    <section className="py-6 lg:py-8">
      <div className="container mx-auto px-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group relative overflow-hidden rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl ${link.color} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
                >
                  <link.icon className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {link.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {link.description}
                  </p>
                </div>
              </div>
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-muted/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
