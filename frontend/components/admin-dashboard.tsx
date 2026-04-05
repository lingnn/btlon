'use client';

import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/auth-store';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Users, Clock3, BadgeCheck, LogOut, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

type DashboardOverview = {
  totals: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
  statusDistribution: Array<{ name: 'Approved' | 'Pending' | 'Rejected'; value: number }>;
  topMajors: Array<{ name: string; count: number; submittedCount: number; acceptedCount: number }>;
};

const pieColors = ['#16a34a', '#f59e0b', '#ef4444'];

const renderActivePieShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    value,
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={outerRadius + 4}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        fillOpacity={0.3}
      />
      <text x={cx} y={cy - 2} textAnchor="middle" fill="#111827" className="text-xs font-semibold">
        {payload?.name}
      </text>
      <text x={cx} y={cy + 16} textAnchor="middle" fill="#6b7280" className="text-xs">
        {Number(value || 0).toLocaleString('vi-VN')} hồ sơ
      </text>
    </g>
  );
};

export function AdminDashboard() {
  const router = useRouter();
  const { user, token, logout } = useAuthStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [activePieIndex, setActivePieIndex] = useState(-1);

  const accessToken =
    token ||
    (typeof window !== 'undefined'
      ? localStorage.getItem('authToken') || localStorage.getItem('token')
      : null);

  const { data, isLoading, error, mutate } = useSWR<DashboardOverview>(
    accessToken ? ['/admin/dashboard/overview', accessToken] : null,
    ([, tokenValue]) => api.statistic.getStats(tokenValue, 'overview'),
    { refreshInterval: 5000 }
  );

  const topMajors = useMemo(() => {
    return Array.isArray(data?.topMajors) ? data.topMajors.slice(0, 10) : [];
  }, [data?.topMajors]);

  const majorDistribution = useMemo(() => {
    return topMajors.slice(0, 6).map((item) => ({
      name: item.name,
      value: item.submittedCount || item.count,
    }));
  }, [topMajors]);

  useEffect(() => {
    if (!majorDistribution.length) {
      setActivePieIndex(-1);
      return;
    }
    if (activePieIndex > majorDistribution.length - 1) {
      setActivePieIndex(-1);
    }
  }, [majorDistribution, activePieIndex]);

  const totals = data?.totals || { total: 0, pending: 0, approved: 0, rejected: 0 };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleGenerate = async () => {
    if (!accessToken) {
      toast.error('Không tìm thấy token đăng nhập');
      return;
    }

    setIsGenerating(true);
    try {
      await api.statistic.generate(accessToken);
      await mutate();
      toast.success('Đã làm mới dữ liệu thống kê');
    } catch (e: any) {
      toast.error(e?.message || 'Làm mới dữ liệu thất bại');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#b31f24]">
              <span className="text-lg font-bold text-white">P</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#b31f24]">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Tổng quan thống kê tuyển sinh</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              Xin chào, <strong>{user?.fullName}</strong>
            </span>
            <Button onClick={handleGenerate} disabled={isGenerating || isLoading} size="sm" className="gap-2">
              <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
              Làm mới dữ liệu
            </Button>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Đăng Xuất
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Không thể tải dữ liệu thống kê. Vui lòng thử lại.
          </div>
        )}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="border-l-4 border-l-blue-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng hồ sơ</CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {isLoading ? '...' : totals.total.toLocaleString('vi-VN')}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hồ sơ chờ duyệt</CardTitle>
              <Clock3 className="h-5 w-5 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {isLoading ? '...' : totals.pending.toLocaleString('vi-VN')}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hồ sơ đã đỗ</CardTitle>
              <BadgeCheck className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {isLoading ? '...' : totals.approved.toLocaleString('vi-VN')}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hồ sơ bị loại</CardTitle>
              <BadgeCheck className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {isLoading ? '...' : totals.rejected.toLocaleString('vi-VN')}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Phân bố hồ sơ theo ngành</CardTitle>
            </CardHeader>
            <CardContent className="h-[320px] w-full p-3 sm:p-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    formatter={(value: any, _name, meta: any) => [
                      `${Number(value || 0).toLocaleString('vi-VN')} hồ sơ`,
                      meta?.payload?.name || 'Ngành',
                    ]}
                    contentStyle={{
                      borderRadius: '10px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 10px 24px rgba(0, 0, 0, 0.12)',
                    }}
                  />
                  <Pie
                    data={majorDistribution}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    activeIndex={activePieIndex}
                    activeShape={renderActivePieShape}
                    onClick={(_, index) =>
                      setActivePieIndex((prevIndex) => (prevIndex === index ? -1 : index))
                    }
                    isAnimationActive
                    animationBegin={120}
                    animationDuration={900}
                    animationEasing="ease-out"
                    label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {majorDistribution.map((entry, index) => (
                      <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top ngành: hồ sơ đã nộp và đã chấp nhận</CardTitle>
            </CardHeader>
            <CardContent className="h-[380px] w-full p-3 sm:p-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topMajors} margin={{ top: 8, right: 8, left: 8, bottom: 56 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    interval={0}
                    angle={-24}
                    textAnchor="end"
                    height={84}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="submittedCount" fill="#b31f24" name="Hồ sơ đã nộp" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="acceptedCount" fill="#16a34a" name="Hồ sơ đã chấp nhận" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
