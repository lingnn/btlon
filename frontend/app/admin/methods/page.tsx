
'use client';

import { AdmissionMethodForm } from '@/components/admin/admission-method-form';

export default function AdmissionMethodsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">Quản lý Phương thức Xét tuyển</h1>
        <p className="text-gray-600">
          Tạo và cấu hình các phương thức xét tuyển với các trường dữ liệu tùy chỉnh
        </p>
      </div>

      {/* Form Component */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <AdmissionMethodForm />
      </div>
    </div>
  );
}
