"use client";

import Link from "next/link";
import useSWR from "swr";
import { CalendarDays, Eye } from "lucide-react";
import api from "@/lib/api";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";

type ArticleAuthor = {
  fullName?: string;
  email?: string;
};

type ArticleAttachment = {
  name?: string;
  url?: string;
};

type ArticleItem = {
  _id: string;
  title: string;
  content?: string;
  authorId?: string | ArticleAuthor;
  viewCount?: number;
  isPublished: boolean;
  attachments?: ArticleAttachment[];
  publishedAt?: string | null;
  createdAt?: string;
};

function stripHtml(input?: string) {
  if (!input) return "";
  return input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function getExcerpt(content?: string) {
  const text = stripHtml(content);
  if (!text) return "Thông báo đang được cập nhật nội dung mô tả.";
  if (text.length <= 140) return text;
  return `${text.slice(0, 140)}...`;
}

function getPublishedDate(item: ArticleItem) {
  const dateValue = item.publishedAt || item.createdAt;
  if (!dateValue) return "-";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("vi-VN");
}

export default function PublicAnnouncementsPage() {
  const { data, isLoading, error } = useSWR("/announcements/public", async () => {
    const response = await api.article.getAll({
      page: 1,
      limit: 24,
      category: "announcement",
      published: "true",
    });

    return Array.isArray(response?.data) ? (response.data as ArticleItem[]) : [];
  });

  const items = (data || []).filter((item) => item.isPublished);

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
                <span>Thông báo</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Thông báo tuyển sinh</h1>
              <p className="text-red-100 text-lg max-w-2xl">Cập nhật thông báo quan trọng, lịch trình tuyển sinh và thay đổi chính sách tuyển sinh</p>
            </div>
          </section>

          <div className="container mx-auto px-4 py-10 md:py-14">

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden border border-border/80">
                <div className="h-44 animate-pulse bg-muted" />
                <CardContent className="space-y-3 p-5">
                  <div className="h-5 w-4/5 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-full animate-pulse rounded bg-muted" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="border border-destructive/30">
            <CardContent className="p-8 text-center text-destructive">
              Không thể tải danh sách thông báo. Vui lòng thử lại sau.
            </CardContent>
          </Card>
        ) : items.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">Hiện chưa có thông báo đã đăng.</CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const thumbnail = item.attachments?.[0]?.url;

              return (
                <Link key={item._id} href={`/announcements/${item._id}`} className="group block">
                  <Card className="h-full overflow-hidden border border-border/80 transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
                    <div className="relative h-44 w-full overflow-hidden bg-muted">
                      {thumbnail ? (
                        <img
                          src={thumbnail}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                          Không có ảnh
                        </div>
                      )}
                    </div>

                    <CardContent className="flex h-[200px] flex-col p-5">
                      <h2 className="line-clamp-2 text-lg font-semibold leading-snug text-foreground">{item.title}</h2>
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {getExcerpt(item.content)}
                      </p>

                      <div className="mt-auto flex items-center justify-between pt-4 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <Eye className="h-3.5 w-3.5" />
                          {(item.viewCount || 0).toLocaleString("vi-VN")}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {getPublishedDate(item)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
