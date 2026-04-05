"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { Plus, Upload, EyeOff, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  category: string;
  authorId?: string | ArticleAuthor;
  viewCount?: number;
  createdAt?: string;
  isPublished: boolean;
  attachments?: ArticleAttachment[];
};

function formatDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("vi-VN");
}

function getAuthorName(authorId?: string | ArticleAuthor) {
  if (!authorId) return "-";
  if (typeof authorId === "string") return authorId;
  return authorId.fullName || authorId.email || "-";
}

export default function AdminAnnouncementsPage() {
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const {
    data: items = [],
    isLoading,
    error,
    mutate,
  } = useSWR(
    "/admin/announcements",
    async (): Promise<ArticleItem[]> => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken") || localStorage.getItem("token")
          : null;

      if (!token) return [];

      const response = await api.article.getAll(token, {
        page: 1,
        limit: 200,
        category: "announcement",
        published: "all",
      });

      const list = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
          ? response
          : [];

      return list.sort((a, b) => {
        const ta = new Date(a.createdAt || 0).getTime();
        const tb = new Date(b.createdAt || 0).getTime();
        return tb - ta;
      }) as ArticleItem[];
    },
    { refreshInterval: 5000 }
  );

  const publishedCount = useMemo(
    () => items.filter((item) => item.isPublished).length,
    [items]
  );

  const handlePublish = async (id: string) => {
    const token = localStorage.getItem("authToken") || localStorage.getItem("token");
    if (!token) {
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      return;
    }

    setActionLoading(`publish-${id}`);
    try {
      await api.article.publish(token, id);
      toast.success("Đã xuất bản thông báo");
      await mutate();
    } catch (e: any) {
      toast.error(e?.message || "Xuất bản thất bại");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnpublish = async (id: string) => {
    const token = localStorage.getItem("authToken") || localStorage.getItem("token");
    if (!token) {
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      return;
    }

    setActionLoading(`unpublish-${id}`);
    try {
      await api.article.unpublish(token, id);
      toast.success("Đã gỡ thông báo khỏi trạng thái xuất bản");
      await mutate();
    } catch (e: any) {
      toast.error(e?.message || "Gỡ thông báo thất bại");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    const confirmed = window.confirm(`Bạn có chắc muốn xóa thông báo \"${title}\"?`);
    if (!confirmed) return;

    const token = localStorage.getItem("authToken") || localStorage.getItem("token");
    if (!token) {
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      return;
    }

    setActionLoading(`delete-${id}`);
    try {
      await api.article.delete(token, id);
      toast.success("Xóa thông báo thành công");
      await mutate();
    } catch (e: any) {
      toast.error(e?.message || "Xóa thông báo thất bại");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý thông báo</h1>
          <p className="text-gray-500">
            Tổng {items.length} thông báo, đã đăng {publishedCount} thông báo
          </p>
        </div>

        <Button asChild>
          <Link href="/admin/announcements/create">
            <Plus className="mr-2 h-4 w-4" />
            Thêm mới
          </Link>
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Danh sách thông báo</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hình ảnh</TableHead>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Tác giả</TableHead>
                <TableHead>Lượt xem</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-gray-500">
                    Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-red-600">
                    Không thể tải danh sách thông báo
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-gray-500">
                    Chưa có thông báo nào
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => {
                  const thumbnail = item.attachments?.[0]?.url;
                  const isPublished = item.isPublished;

                  return (
                    <TableRow key={item._id}>
                      <TableCell>
                        {thumbnail ? (
                          <img
                            src={thumbnail}
                            alt={item.title}
                            className="h-12 w-20 rounded-md object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="h-12 w-20 rounded-md border border-dashed border-gray-300 bg-gray-50" />
                        )}
                      </TableCell>
                      <TableCell className="max-w-[320px]">
                        <p className="line-clamp-2 font-medium text-gray-900">{item.title}</p>
                      </TableCell>
                      <TableCell>{getAuthorName(item.authorId)}</TableCell>
                      <TableCell>{(item.viewCount || 0).toLocaleString("vi-VN")}</TableCell>
                      <TableCell>{formatDate(item.createdAt)}</TableCell>
                      <TableCell>
                        {isPublished ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Đã đăng</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                            Bản nháp
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          {isPublished ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUnpublish(item._id)}
                              disabled={actionLoading === `unpublish-${item._id}`}
                            >
                              <EyeOff className="mr-1 h-4 w-4" />
                              Gỡ bài
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handlePublish(item._id)}
                              disabled={actionLoading === `publish-${item._id}`}
                            >
                              <Upload className="mr-1 h-4 w-4" />
                              Xuất bản
                            </Button>
                          )}

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(item._id, item.title)}
                            disabled={actionLoading === `delete-${item._id}`}
                          >
                            <Trash2 className="mr-1 h-4 w-4" />
                            Xóa
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
