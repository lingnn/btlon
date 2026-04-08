"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { useSWRConfig } from "swr";
import { Search, Users, UserCheck, UserRound, Eye, Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import api, { AdminUser, UserDetailResponse, UserSummary } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const applicationStatusLabel: Record<string, string> = {
  draft: "Bản nháp",
  submitted: "Đã nộp",
  under_review: "Đang xét duyệt",
  need_more_info: "Cần bổ sung",
  approved: "Đã duyệt",
  rejected: "Từ chối",
};

const roleLabel: Record<AdminUser["role"], string> = {
  candidate: "Thí sinh",
  content_admin: "Quản trị nội dung",
  system_admin: "Quản trị hệ thống",
};

export default function AdminUsersPage() {
  const { token, user: currentUser } = useAuthStore();
  const { mutate } = useSWRConfig();
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [updatingRoleUserId, setUpdatingRoleUserId] = useState<string | null>(null);

  const accessToken =
    token ||
    (typeof window !== "undefined"
      ? localStorage.getItem("authToken") || localStorage.getItem("token")
      : null);

  const { data: users = [], isLoading: isLoadingUsers, error: usersError } = useSWR<AdminUser[], Error, [string, string] | null>(
    accessToken ? ["/admin/users", accessToken] : null,
    ([, tokenValue]) => api.users.getAll(tokenValue)
  );

  const { data: summary, isLoading: isLoadingSummary } = useSWR<UserSummary, Error, [string, string] | null>(
    accessToken ? ["/admin/users/summary", accessToken] : null,
    ([, tokenValue]) => api.users.getSummary(tokenValue)
  );

  const {
    data: selectedUserDetail,
    isLoading: isLoadingDetail,
    error: detailError,
  } = useSWR<UserDetailResponse, Error, [string, string, string] | null>(
    accessToken && selectedUserId ? ["/admin/users/detail", accessToken, selectedUserId] : null,
    ([, tokenValue, userId]) => api.users.getDetail(tokenValue, userId)
  );

  const handleRoleChange = async (
    userId: string,
    nextRole: "candidate" | "content_admin" | "system_admin"
  ) => {
    if (!accessToken) {
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      return;
    }

    try {
      const targetUser = users.find((item) => item._id === userId);
      if (targetUser && targetUser.role === nextRole) {
        return;
      }

      setUpdatingRoleUserId(userId);
      await api.users.updateRole(accessToken, userId, nextRole);
      toast.success("Cập nhật vai trò thành công");
      await Promise.all([
        mutate(["/admin/users", accessToken]),
        mutate(["/admin/users/summary", accessToken]),
        selectedUserId === userId
          ? mutate(["/admin/users/detail", accessToken, userId])
          : Promise.resolve(),
      ]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Cập nhật vai trò thất bại");
    } finally {
      setUpdatingRoleUserId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return users;

    return users.filter((user) => {
      return [user.username, user.fullName, user.email, user.phone]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(keyword));
    });
  }, [users, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
        <p className="text-gray-500">Dữ liệu được đồng bộ trực tiếp từ MongoDB.</p>
      </div>

      {usersError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Không thể tải danh sách người dùng. Vui lòng thử lại.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card className="border-l-4 border-l-blue-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {isLoadingSummary ? "..." : (summary?.totalUsers ?? users.length).toLocaleString("vi-VN")}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tài khoản thí sinh</CardTitle>
            <UserRound className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {isLoadingSummary
                ? "..."
                : (summary?.totalCandidates ?? users.filter((u) => u.role === "candidate").length).toLocaleString("vi-VN")}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tài khoản quản trị</CardTitle>
            <UserCheck className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {isLoadingSummary
                ? "..."
                : (summary?.totalAdmins
                    ?? users.filter((u) => u.role === "system_admin" || u.role === "content_admin").length
                  ).toLocaleString("vi-VN")}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng</CardTitle>
          <div className="relative mt-3 w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên, username, email, số điện thoại"
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên đăng nhập</TableHead>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Phân quyền</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Chi tiết</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingUsers ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-gray-500">
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-gray-500">
                      Không có người dùng phù hợp
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.fullName || "-"}</TableCell>
                      <TableCell>{user.email || "-"}</TableCell>
                      <TableCell>{user.phone || "-"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "candidate"
                              ? "secondary"
                              : user.role === "content_admin"
                                ? "outline"
                                : "default"
                          }
                        >
                          {roleLabel[user.role]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(
                                user._id,
                                e.target.value as "candidate" | "content_admin" | "system_admin"
                              )
                            }
                            disabled={
                              updatingRoleUserId === user._id ||
                              currentUser?.id === user._id
                            }
                            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                          >
                            <option value="candidate">Thí sinh</option>
                            <option value="content_admin">Quản trị nội dung</option>
                            <option value="system_admin">Quản trị hệ thống</option>
                          </select>
                          {updatingRoleUserId === user._id && (
                            <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("vi-VN")
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedUserId(user._id)}
                          className="gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          Xem
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(selectedUserId)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedUserId(null);
          }
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Chi tiết thí sinh và hồ sơ đã nộp</DialogTitle>
            <DialogDescription>
              Xem thông tin cá nhân và toàn bộ hồ sơ của thí sinh đã chọn.
            </DialogDescription>
          </DialogHeader>

          {isLoadingDetail ? (
            <div className="py-8 text-center text-sm text-gray-500">Đang tải chi tiết...</div>
          ) : detailError ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {detailError.message || "Không thể tải chi tiết thí sinh"}
            </div>
          ) : selectedUserDetail ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cá nhân</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-gray-500">Họ tên</p>
                    <p className="font-medium">{selectedUserDetail.user.fullName || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Tên đăng nhập</p>
                    <p className="font-medium">{selectedUserDetail.user.username || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium">{selectedUserDetail.user.email || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Số điện thoại</p>
                    <p className="font-medium">{selectedUserDetail.user.phone || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Vai trò</p>
                    <p className="font-medium">{roleLabel[selectedUserDetail.user.role]}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Ngày tạo tài khoản</p>
                    <p className="font-medium">
                      {selectedUserDetail.user.createdAt
                        ? new Date(selectedUserDetail.user.createdAt).toLocaleString("vi-VN")
                        : "-"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Hồ sơ đã nộp ({selectedUserDetail.applications.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedUserDetail.applications.length === 0 ? (
                    <p className="text-sm text-gray-500">Thí sinh này chưa có hồ sơ nào.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Mã hồ sơ</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Ngày nộp</TableHead>
                            <TableHead>Nguyện vọng</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedUserDetail.applications.map((app) => (
                            <TableRow key={app._id}>
                              <TableCell className="font-medium">{app.applicationCode}</TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {applicationStatusLabel[app.status] || app.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {app.submissionDate
                                  ? new Date(app.submissionDate).toLocaleString("vi-VN")
                                  : "-"}
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1 text-sm">
                                  {(app.preferences || []).length === 0 ? (
                                    <span className="text-gray-500">Chưa có nguyện vọng</span>
                                  ) : (
                                    app.preferences?.map((pref, index) => (
                                      <div key={`${app._id}-${pref.priority}-${index}`}>
                                        NV{pref.priority}: {pref.majorId?.name || "-"} ({pref.methodId?.name || "-"})
                                      </div>
                                    ))
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
