"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { ArrowLeft, CalendarDays, Eye } from "lucide-react";
import api from "@/lib/api";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ArticleAuthor = {
  fullName?: string;
  email?: string;
};

type ArticleAttachment = {
  name?: string;
  url?: string;
};

type ArticleDetail = {
  _id: string;
  title: string;
  content?: string;
  authorId?: string | ArticleAuthor;
  viewCount?: number;
  attachments?: ArticleAttachment[];
  publishedAt?: string | null;
  createdAt?: string;
};

function getDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("vi-VN");
}

function getAuthorName(authorId?: string | ArticleAuthor) {
  if (!authorId) return "Ban tuyển sinh";
  if (typeof authorId === "string") return authorId;
  return authorId.fullName || authorId.email || "Ban tuyển sinh";
}

export default function AnnouncementDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const { data, isLoading, error } = useSWR(
    id ? `/announcements/${id}` : null,
    async () => {
      if (!id) return null;
      return api.article.getById(id);
    }
  );

  const item = data as ArticleDetail | null;
  const cover = item?.attachments?.[0]?.url;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-10 md:py-14">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/announcements">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại danh sách thông báo
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">Đang tải thông báo...</CardContent>
          </Card>
        ) : error || !item ? (
          <Card className="border border-destructive/30">
            <CardContent className="p-8 text-center text-destructive">Không thể tải thông báo.</CardContent>
          </Card>
        ) : (
          <article className="mx-auto max-w-4xl space-y-6">
            <header className="space-y-3">
              <h1 className="text-3xl font-bold leading-tight text-foreground md:text-4xl">{item.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span>Tác giả: {getAuthorName(item.authorId)}</span>
                <span className="inline-flex items-center gap-1.5">
                  <Eye className="h-4 w-4" />
                  {(item.viewCount || 0).toLocaleString("vi-VN")}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  {getDate(item.publishedAt || item.createdAt)}
                </span>
              </div>
            </header>

            {cover ? (
              <div className="overflow-hidden rounded-xl border border-border/80">
                <img src={cover} alt={item.title} className="h-auto w-full object-cover" />
              </div>
            ) : null}

            <section
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: item.content || "<p>Nội dung đang được cập nhật.</p>" }}
            />
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
}
