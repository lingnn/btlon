"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { ArrowLeft, CalendarDays, Eye, Mail, Printer, Share2, User } from "lucide-react";
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
  category?: string;
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

export default function NewsDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const { data, isLoading, error } = useSWR(
    id ? `/news/${id}` : null,
    async () => {
      if (!id) return null;
      return api.article.getById(id);
    }
  );

  const article = data as ArticleDetail | null;
  const cover = article?.attachments?.[0]?.url;
  const isScholarship = article?.category === "scholarship";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-10 md:py-14">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/news">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại danh sách tin tức
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">Đang tải bài viết...</CardContent>
          </Card>
        ) : error || !article ? (
          <Card className="border border-destructive/30">
            <CardContent className="p-8 text-center text-destructive">Không thể tải bài viết.</CardContent>
          </Card>
        ) : (
          <article className="mx-auto max-w-5xl">
            {isScholarship ? (
              <div className="overflow-hidden rounded-2xl border border-border/70 bg-white shadow-sm">
                <div className="h-2 bg-gradient-to-r from-[#7f0000] via-[#b31f24] to-[#e25a1c]" />
                <div className="p-6 md:p-10">
                  <div className="max-w-4xl">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#b31f24]/15 bg-[#b31f24]/5 px-4 py-1.5 text-sm font-medium text-[#b31f24]">
                      <span className="h-2 w-2 rounded-full bg-[#b31f24]" />
                      Chương trình học bổng
                    </div>

                    <h1 className="text-3xl font-bold leading-tight text-[#0f2d6e] md:text-5xl">
                      {article.title}
                    </h1>

                    <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-slate-600">
                      <span className="inline-flex items-center gap-2">
                        <TagInfo />
                        Chương trình học bổng
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-[#b31f24]" />
                        {getDate(article.publishedAt || article.createdAt)}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <User className="h-4 w-4 text-[#b31f24]" />
                        {getAuthorName(article.authorId)}
                      </span>
                    </div>

                    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
                      <div>
                        {cover ? (
                          <div className="overflow-hidden rounded-2xl border border-border/70 bg-slate-50">
                            <img src={cover} alt={article.title} className="h-auto w-full object-cover" />
                          </div>
                        ) : null}

                        <section
                          className="prose prose-slate mt-8 max-w-none prose-p:leading-8 prose-p:text-[17px] prose-strong:text-slate-900"
                          dangerouslySetInnerHTML={{ __html: article.content || "<p>Nội dung đang được cập nhật.</p>" }}
                        />
                      </div>

                      <aside className="space-y-4 lg:pt-2">
                        <div className="rounded-2xl border border-border/70 bg-slate-50 p-5">
                          <h2 className="text-base font-semibold text-slate-900">Thông tin nhanh</h2>
                          <dl className="mt-4 space-y-4 text-sm text-slate-600">
                            <div className="flex items-start justify-between gap-4">
                              <dt>Trạng thái</dt>
                              <dd className="font-medium text-[#b31f24]">Đang cập nhật</dd>
                            </div>
                            <div className="flex items-start justify-between gap-4">
                              <dt>Lượt xem</dt>
                              <dd className="font-medium text-slate-900">{(article.viewCount || 0).toLocaleString("vi-VN")}</dd>
                            </div>
                            <div className="flex items-start justify-between gap-4">
                              <dt>Ngày đăng</dt>
                              <dd className="font-medium text-slate-900">{getDate(article.publishedAt || article.createdAt)}</dd>
                            </div>
                          </dl>
                        </div>

                        <div className="rounded-2xl border border-border/70 bg-white p-5 shadow-sm">
                          <h2 className="text-base font-semibold text-slate-900">Chia sẻ</h2>
                          <div className="mt-4 flex gap-3">
                            <IconAction label="Facebook" icon={<Share2 className="h-4 w-4" />} />
                            <IconAction label="Email" icon={<Mail className="h-4 w-4" />} />
                            <IconAction label="In" icon={<Printer className="h-4 w-4" />} />
                          </div>
                        </div>
                      </aside>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <article className="mx-auto max-w-4xl space-y-6">
                <header className="space-y-3">
                  <h1 className="text-3xl font-bold leading-tight text-foreground md:text-4xl">{article.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span>Tác giả: {getAuthorName(article.authorId)}</span>
                    <span className="inline-flex items-center gap-1.5">
                      <Eye className="h-4 w-4" />
                      {(article.viewCount || 0).toLocaleString("vi-VN")}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4" />
                      {getDate(article.publishedAt || article.createdAt)}
                    </span>
                  </div>
                </header>

                {cover ? (
                  <div className="overflow-hidden rounded-xl border border-border/80">
                    <img src={cover} alt={article.title} className="h-auto w-full object-cover" />
                  </div>
                ) : null}

                <section
                  className="prose prose-slate max-w-none"
                  dangerouslySetInnerHTML={{ __html: article.content || "<p>Nội dung đang được cập nhật.</p>" }}
                />
              </article>
            )}
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
}

function TagInfo() {
  return <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#b31f24] text-[10px] font-bold text-white">#</span>;
}

function IconAction({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full bg-[#b31f24] text-white transition-colors hover:bg-[#8f191d]"
    >
      {icon}
    </button>
  );
}
