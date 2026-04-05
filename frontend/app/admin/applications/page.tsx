"use client";

import { useMemo, useState } from "react";
import { Search, Eye, Clock, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useSWR from "swr";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import api from "@/lib/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "need_more_info"
  | "approved"
  | "rejected";

type PreferenceStatus = "pending" | "approved" | "rejected";

type ApplicationPreference = {
  _id?: string;
  id?: string; // mongoose embedded doc id used by some updates
  priority: number;
  majorId?: {
    _id?: string;
    code?: string;
    name?: string;
  };
  methodId?: {
    _id?: string;
    name?: string;
  };
  methodData?: Record<string, unknown>;
  status?: PreferenceStatus;
  note?: string;
};

type ApplicationDocument = {
  name: string;
  url: string;
  uploadDate?: string;
};

type AdminApplication = {
  _id: string;
  applicationCode: string;
  idNumber?: string;
  fullName: string;
  email?: string;
  phone?: string;
  address?: string;
  highSchool?: string;
  graduationYear?: number;
  preferences?: ApplicationPreference[];
  documents?: ApplicationDocument[];
  status: ApplicationStatus;
  submissionDate?: string;
  createdAt?: string;
};

const statusConfig: Partial<
  Record<
    ApplicationStatus,
    {
      label: string;
      variant: "default" | "secondary" | "destructive" | "outline";
      className?: string;
      icon: React.ComponentType<{ className?: string }>;
    }
  >
> = {
  submitted: {
    label: "Đang chờ",
    variant: "default",
    className: "bg-blue-600 text-white hover:bg-blue-700 border-transparent",
    icon: CheckCircle,
  },
  under_review: {
    label: "Đang xét duyệt",
    variant: "secondary",
    className: "bg-yellow-500 text-black hover:bg-yellow-600 border-transparent",
    icon: Clock,
  },
  approved: {
    label: "Đã duyệt",
    variant: "default",
    className: "bg-green-600 text-white hover:bg-green-700 border-transparent",
    icon: CheckCircle,
  },
  rejected: {
    label: "Từ chối",
    variant: "destructive",
    className: "bg-red-600 text-white hover:bg-red-700 border-transparent",
    icon: XCircle,
  },
  need_more_info: {
    label: "Cần bổ sung",
    variant: "outline",
    className: "border-yellow-200 text-yellow-700 hover:bg-yellow-50",
    icon: Clock,
  },
};

const prefStatusConfig: Record<
  PreferenceStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  pending: { label: "Đang chờ", variant: "secondary" },
  approved: { label: "Đã duyệt", variant: "default" },
  rejected: { label: "Từ chối", variant: "destructive" },
};

function formatDate(value?: string | Date) {
  if (!value) return "-";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("vi-VN");
}

function safeJson(value: unknown) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export default function ApplicationsPage() {
  const { data: applications = [], isLoading, error, mutate } = useSWR<AdminApplication[]>(
    "/admin/applications",
    async () => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken") || localStorage.getItem("token")
          : null;
      if (!token) return [];

      const [submittedRes, underReviewRes] = await Promise.all([
        api.application.getAll(token, { status: "submitted", page: 1, limit: 100 }),
        api.application.getAll(token, { status: "under_review", page: 1, limit: 100 }),
      ]);

      const submittedApps: AdminApplication[] = Array.isArray(submittedRes?.data)
        ? submittedRes.data
        : Array.isArray(submittedRes)
          ? submittedRes
          : [];

      const underReviewApps: AdminApplication[] = Array.isArray(underReviewRes?.data)
        ? underReviewRes.data
        : Array.isArray(underReviewRes)
          ? underReviewRes
          : [];

      const all = [...submittedApps, ...underReviewApps];
      const unique = new Map<string, AdminApplication>();
      for (const a of all) unique.set(String(a._id), a);

      return Array.from(unique.values()).sort((a, b) => {
        const ta = new Date(a.submissionDate || a.createdAt || 0).getTime();
        const tb = new Date(b.submissionDate || b.createdAt || 0).getTime();
        return tb - ta;
      });
    },
    { refreshInterval: 5000 }
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState<AdminApplication | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [rejectNotes, setRejectNotes] = useState<Record<string, string>>({});
  const [decisionLoading, setDecisionLoading] = useState<string | null>(null);

  const filteredApplications = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return applications;

    return applications.filter((app) => {
      return (
        app.applicationCode.toLowerCase().includes(q) ||
        (app.fullName || "").toLowerCase().includes(q) ||
        (app.email || "").toLowerCase().includes(q) ||
        (app.phone || "").toLowerCase().includes(q)
      );
    });
  }, [applications, searchQuery]);

  const overallStatusCfg = selectedApp ? statusConfig[selectedApp.status] : undefined;

  const handleViewDetail = async (app: AdminApplication) => {
    setSelectedApp(app);
    setDetailDialogOpen(true);
    setDetailLoading(true);

    try {
      const token = localStorage.getItem("authToken") || localStorage.getItem("token");
      if (!token) throw new Error("Không tìm thấy token đăng nhập");

      const res = await fetch(`${API_BASE_URL}/applications/${app._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || "Không thể tải chi tiết hồ sơ");
      }

      const detail = (await res.json()) as AdminApplication;
      setSelectedApp(detail);
    } catch (e: any) {
      toast.error(e?.message || "Không thể tải chi tiết hồ sơ");
    } finally {
      setDetailLoading(false);
    }
  };

  const handlePreferenceDecision = async (prefId: string, action: "approved" | "rejected") => {
    if (!selectedApp) return;
    if (!prefId) {
      toast.error("Không tìm thấy id nguyện vọng");
      return;
    }

    const token = localStorage.getItem("authToken") || localStorage.getItem("token");
    if (!token) {
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      return;
    }

    setDecisionLoading(prefId);
    try {
      const note = (rejectNotes[prefId] || "").trim();

      const payload =
        action === "approved"
          ? {
              status: "approved",
              preferencesStatus: [{ id: prefId, status: "approved" }],
            }
          : {
              status: "rejected",
              preferencesStatus: [{ id: prefId, status: "rejected", note }],
            };

      const res = await fetch(`${API_BASE_URL}/applications/${selectedApp._id}/review`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || "Cập nhật nguyện vọng thất bại");
      }

      const updated = (await res.json()) as AdminApplication;
      setSelectedApp(updated);
      toast.success(action === "approved" ? "Đã chấp nhận (Pass)" : "Đã từ chối (Fail)");

      // Cập nhật real-time danh sách
      await mutate();
    } catch (e: any) {
      toast.error(e?.message || "Không thể cập nhật nguyện vọng");
    } finally {
      setDecisionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý hồ sơ</h1>
        <p className="text-gray-500">Danh sách hồ sơ từ `submitted` và `under_review`</p>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc mã hồ sơ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">
            Danh sách hồ sơ ({filteredApplications.length})
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã hồ sơ</TableHead>
                <TableHead>Họ tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày nộp</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-gray-500">
                    Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              ) : filteredApplications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-gray-500">
                    Không tìm thấy hồ sơ phù hợp
                  </TableCell>
                </TableRow>
              ) : (
                filteredApplications.map((app) => {
                  const dateText = formatDate(app.submissionDate || app.createdAt);
                  const status = statusConfig[app.status];
                  if (!status) return null;

                  return (
                    <TableRow key={app._id}>
                      <TableCell className="font-medium">{app.applicationCode}</TableCell>
                      <TableCell>{app.fullName}</TableCell>
                      <TableCell>{app.email || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={status.variant} className={`gap-1 ${status.className || ""}`}>
                          <status.icon className="w-3 h-3" />
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>{dateText}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewDetail(app)}>
                            <Eye className="w-4 h-4 mr-1" />
                            Xem chi tiết
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

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết hồ sơ</DialogTitle>
            <DialogDescription>
              Mã hồ sơ: {selectedApp?.applicationCode}
            </DialogDescription>
          </DialogHeader>

          {!selectedApp ? (
            <div className="py-6 text-center text-gray-500">Chưa có dữ liệu</div>
          ) : (
            <div className="space-y-6">
              {detailLoading && (
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" />
                  Đang tải chi tiết...
                </div>
              )}

              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-gray-900">Thông tin cá nhân</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Họ tên</p>
                    <p className="font-medium">{selectedApp.fullName || "-"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">CCCD</p>
                    <p className="font-medium">{selectedApp.idNumber || "-"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium">{selectedApp.email || "-"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Số điện thoại</p>
                    <p className="font-medium">{selectedApp.phone || "-"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">Địa chỉ</p>
                    <p className="font-medium">{selectedApp.address || "-"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Trường THPT</p>
                    <p className="font-medium">{selectedApp.highSchool || "-"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Năm tốt nghiệp</p>
                    <p className="font-medium">{selectedApp.graduationYear ?? "-"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">Ngày nộp</p>
                    <p className="font-medium">
                      {formatDate(selectedApp.submissionDate || selectedApp.createdAt)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">Trạng thái</p>
                    <Badge
                      variant={overallStatusCfg?.variant || "secondary"}
                      className={`gap-1 ${overallStatusCfg?.className || ""}`}
                    >
                      {overallStatusCfg?.icon ? (
                        (() => {
                          const StatusIcon = overallStatusCfg.icon;
                          return <StatusIcon className="w-3 h-3" />;
                        })()
                      ) : null}
                      {overallStatusCfg?.label || "-"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-gray-900">Nguyện vọng</h2>
                {selectedApp.preferences?.length ? (
                  <div className="space-y-4">
                    {selectedApp.preferences
                      .slice()
                      .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
                      .map((pref) => {
                        const prefStatus = (pref.status || "pending") as PreferenceStatus;
                        const prefId = String(pref._id || pref.id || "");
                        const major = pref.majorId?.name
                          ? `${pref.majorId.name}${pref.majorId.code ? ` (${pref.majorId.code})` : ""}`
                          : "-";
                        const method = pref.methodId?.name || "-";

                        const methodData = pref.methodData || {};
                        const hasMethodData = Object.keys(methodData).length > 0;

                        return (
                          <div
                            key={pref._id || pref.id || `${pref.priority}-${major}`}
                            className="border rounded-lg p-4 space-y-3"
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div className="space-y-1">
                                <div className="text-sm font-semibold text-gray-900">
                                  {pref.priority ? `Ưu tiên ${pref.priority}` : "Nguyện vọng"}
                                </div>
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium text-gray-900">Ngành:</span> {major}
                                </div>
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium text-gray-900">Phương thức:</span> {method}
                                </div>
                              </div>
                              <div>
                                <Badge variant={prefStatusConfig[prefStatus].variant}>
                                  {prefStatusConfig[prefStatus].label}
                                </Badge>
                              </div>
                            </div>

                            {pref.note ? (
                              <div className="text-sm">
                                <span className="font-medium text-gray-900">Ghi chú: </span>
                                {pref.note}
                              </div>
                            ) : null}

                            {hasMethodData ? (
                              <div>
                                <p className="text-sm font-medium text-gray-900 mb-2">Dữ liệu phương thức</p>
                                <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                                  {safeJson(methodData)}
                                </pre>
                              </div>
                            ) : null}

                            <div className="pt-3 border-t space-y-2">
                              <div className="flex flex-wrap gap-2">
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  disabled={decisionLoading === prefId || !prefId}
                                  onClick={() => handlePreferenceDecision(prefId, "approved")}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Chấp nhận (Pass)
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                  disabled={decisionLoading === prefId || !prefId}
                                  onClick={() => handlePreferenceDecision(prefId, "rejected")}
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Từ chối (Fail)
                                </Button>
                              </div>

                              <div>
                                <p className="text-xs font-medium text-gray-500">Ghi chú (cho Fail)</p>
                                <Input
                                  value={rejectNotes[prefId] || ""}
                                  onChange={(e) => setRejectNotes((prev) => ({ ...prev, [prefId]: e.target.value }))}
                                  placeholder="Nhập lý do từ chối..."
                                  className="mt-1"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">Chưa có nguyện vọng</div>
                )}
              </div>

              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-gray-900">Ảnh minh chứng</h2>
                {selectedApp.documents?.length ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedApp.documents.map((doc, idx) => {
                      if (!doc?.url) {
                        return (
                          <div
                            key={`${doc.name}-${idx}`}
                            className="border rounded-lg p-3 text-sm text-gray-500"
                          >
                            {doc?.name || `Tài liệu ${idx + 1}`}
                          </div>
                        );
                      }

                      return (
                        <a
                          key={`${doc.name}-${idx}`}
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="border rounded-lg overflow-hidden hover:shadow-sm transition-shadow bg-white"
                        >
                          <div className="p-3">
                            <div className="text-sm font-medium text-gray-900">
                              {doc.name || `Tài liệu ${idx + 1}`}
                            </div>
                            {doc.uploadDate ? (
                              <div className="text-xs text-gray-500 mt-1">
                                Tải lên: {formatDate(doc.uploadDate)}
                              </div>
                            ) : null}
                          </div>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={doc.url}
                            alt={doc.name || `Tài liệu ${idx + 1}`}
                            className="w-full h-52 object-contain bg-gray-50"
                          />
                        </a>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">Chưa có ảnh minh chứng</div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
