"use client";

import Link from "next/link";
import { CalendarDays, ExternalLink } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";

type PressArticle = {
  id: string;
  source: string;
  sourceLogo: string;
  publishedDate: string;
  title: string;
  excerpt: string;
  url: string;
};

const pressArticles: PressArticle[] = [
  {
    id: "bao-chinh-phu-1",
    source: "Báo Chính Phủ",
    sourceLogo: "",
    publishedDate: "2025-04-24",
    title: "Thủ tướng đề nghị Học viện Công nghệ Bưu chính Viễn thông phát huy 5 tiên phong",
    excerpt:
      "Thủ tướng nhấn mạnh vai trò tiên phong của PTIT trong đổi mới đào tạo, nghiên cứu và chuyển đổi số, đáp ứng nhu cầu phát triển nguồn nhân lực chất lượng cao.",
    url: "https://baochinhphu.vn/thu-tuong-de-nghi-hoc-vien-cong-nghe-buu-chinh-vien-thong-phat-huy-5-tien-phong-102250424113516058.htm",
  },
  {
    id: "giaoduc-vn-1",
    source: "Tạp chí điện tử Giáo dục Việt Nam",
    sourceLogo: "https://giaoduc.net.vn/dataimages/0/2015/08/26/duongngoc/giaoduc.net.vn.jpg",
    publishedDate: "2024-06-25",
    title: "Năm 2026, Học viện Công nghệ Bưu chính Viễn thông tuyển sinh đại học chính quy với 5 phương thức",
    excerpt:
      "Thông tin tuyển sinh đại học chính quy năm 2026 của PTIT với 5 phương thức xét tuyển, chỉ tiêu và các mốc thời gian quan trọng cho thí sinh.",
    url: "https://giaoduc.net.vn/nam-2026-hoc-vien-cong-nghe-buu-chinh-vien-thong-tuyen-sinh-dai-hoc-chinh-quy-voi-5-phuong-thuc-post259000.gd",
  },
];

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("vi-VN");
}

export default function PublicNewsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

        <main>
          {/* Hero Section */}
          <section 
            className="relative text-white py-24 md:py-32 overflow-hidden"
            style={{
              backgroundImage: 'url(/images/about-hero.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed'
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-800/90 to-red-900/80"></div>
          
            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2 mb-6">
                <Link href="/" className="hover:text-red-200 transition-colors flex items-center gap-1">
                  <span>🏠</span>
                  <span>Giới thiệu</span>
                </Link>
                <span>›</span>
                <span>Tin tức tuyển sinh</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Tin tức tuyển sinh</h1>
              <p className="text-red-100 text-lg max-w-2xl">Cập nhật mới nhất về thông báo, quy chế, kết quả tuyển sinh và các hoạt động quan trọng</p>
            </div>
          </section>

          <div className="container mx-auto px-4 py-10 md:py-14">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pressArticles.map((article) => {
              return (
                  <a
                    key={article.id}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                  <Card className="h-full overflow-hidden border border-border/80 transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
                      <div className="relative h-44 w-full overflow-hidden bg-white px-6 py-4">
                        {article.sourceLogo ? (
                        <img
                            src={article.sourceLogo}
                            alt={article.source}
                            className="h-full w-full object-contain"
                        />
                      ) : (
                          <div className="flex h-full w-full items-center justify-center rounded-md bg-muted text-base font-semibold text-muted-foreground">
                            {article.source}
                        </div>
                      )}
                    </div>

                    <CardContent className="flex h-[220px] flex-col p-5">
                        <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-700">
                          <CalendarDays className="h-4 w-4" />
                          {formatDate(article.publishedDate)}
                        </div>

                        <h2 className="mt-4 line-clamp-2 text-4xl font-semibold leading-tight text-slate-900">
                          {article.title}
                        </h2>
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{article.excerpt}</p>

                        <div className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-medium text-slate-700 group-hover:text-red-700">
                          Đọc bài gốc
                          <ExternalLink className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                  </a>
              );
            })}
          </div>
          </div>
      </main>

      <Footer />
    </div>
  );
}
