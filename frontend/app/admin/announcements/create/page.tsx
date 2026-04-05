"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateAnnouncementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    thumbnail: "",
    content: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề thông báo");
      return;
    }

    if (!formData.content.trim()) {
      toast.error("Vui lòng nhập nội dung thông báo");
      return;
    }

    const token = localStorage.getItem("authToken") || localStorage.getItem("token");
    if (!token) {
      toast.error("Phiên đăng nhập đã hết hạn");
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        title: formData.title.trim(),
        category: "announcement",
        content: formData.content.trim(),
      };

      if (formData.thumbnail.trim()) {
        payload.attachments = [
          {
            name: "thumbnail",
            url: formData.thumbnail.trim(),
          },
        ];
      }

      await api.article.create(token, payload);

      toast.success("Tạo thông báo thành công!");
      router.push("/admin/announcements");
    } catch (error: any) {
      toast.error(error?.message || "Tạo thông báo thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/announcements">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tạo thông báo mới</h1>
          <p className="text-gray-500">Soạn thảo nội dung thông báo cho thí sinh</p>
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Thông tin thông báo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tiêu đề */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Tiêu đề <span className="text-red-600">*</span>
              </label>
              <Input
                type="text"
                name="title"
                placeholder="Nhập tiêu đề thông báo..."
                value={formData.title}
                onChange={handleChange}
                className="text-base"
              />
            </div>

            {/* Ảnh Thumbnail */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                URL Ảnh Thumbnail
              </label>
              <Input
                type="url"
                name="thumbnail"
                placeholder="https://example.com/image.jpg"
                value={formData.thumbnail}
                onChange={handleChange}
                className="text-base"
              />
              {formData.thumbnail && (
                <div className="relative h-32 w-48 overflow-hidden rounded-lg border border-gray-200">
                  <img
                    src={formData.thumbnail}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Nội dung */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Nội dung thông báo <span className="text-red-600">*</span>
              </label>
              <textarea
                name="content"
                placeholder="Nhập nội dung thông báo (hỗ trợ HTML)..."
                value={formData.content}
                onChange={handleChange}
                rows={12}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-base font-normal text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="text-xs text-gray-500">
                Bạn có thể sử dụng các tag HTML cơ bản: &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;img&gt;, v.v.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="gap-2 bg-red-600 hover:bg-red-700"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Đang lưu..." : "Lưu thông báo"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/announcements")}
                disabled={loading}
              >
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
