'use client';

import { MajorForm } from '@/components/admin/major-form';

export default function AdminMajorsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">Quản lý Ngành học</h1>
        <p className="text-gray-600">Tạo mới và cấu hình ngành học, bao gồm chỉ tiêu & phương thức xét tuyển.</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <MajorForm />
      </div>
    </div>
  );
}
