'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/lib/auth-store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { admissionAPI } from '@/lib/api';

interface Field {
  id: string;
  key: string;
  label: string;
  type: 'text' | 'file' | 'select' | 'number';
  required: boolean;
}

interface AdmissionMethod {
  name: string;
  code: string;
  year: number | '';
  fields: Field[];
}

export function AdmissionMethodForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AdmissionMethod>({
    name: '',
    code: '',
    year: '',
    fields: [],
  });

  // Xử lý thay đổi các input cơ bản
  const handleBasicInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'year' ? (value ? parseInt(value) : '') : value,
    }));
  };

  // Thêm trường dữ liệu mới
  const addField = () => {
    const newField: Field = {
      id: Date.now().toString(),
      key: '',
      label: '',
      type: 'text',
      required: false,
    };
    setFormData((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));
  };

  // Cập nhật trường dữ liệu
  const updateField = (id: string, field: Partial<Field>) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.map((f) =>
        f.id === id ? { ...f, ...field } : f
      ),
    }));
  };

  // Xóa trường dữ liệu
  const removeField = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.filter((f) => f.id !== id),
    }));
  };

  // Lưu phương thức xét tuyển
  const { token: storeToken } = useAuthStore();
  const token =
    storeToken ||
    (typeof window !== 'undefined'
      ? localStorage.getItem('token') || localStorage.getItem('authToken')
      : null);

  const handleSave = async () => {
    if (!token) {
      toast.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
      return;
    }

    const jsonData = {
      name: formData.name,
      code: formData.code,
      year: Number(formData.year),
      fields: formData.fields.map((f) => ({
        key: f.key,
        label: f.label,
        type: f.type,
        required: f.required,
      })),
      description: '',
      active: true,
    };

    try {
      setIsLoading(true);

      const result = await admissionAPI.createMethod(token, jsonData);

      toast.success('Thêm phương thức xét tuyển thành công');
      console.log('Kết quả từ Server:', result);

      setFormData({
        name: '',
        code: '',
        year: '',
        fields: [],
      });

      setTimeout(() => {
        router.push('/admin/methods');
      }, 800);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Có lỗi xảy ra khi tạo phương thức';
      toast.error(message);
      console.error('Lỗi khi lưu phương thức:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Tạo Phương thức Xét tuyển</h1>
        <p className="text-gray-500">
          Định cấu hình phương thức xét tuyển mới với các trường dữ liệu tùy
          chỉnh
        </p>
      </div>

      {/* Thông tin cơ bản */}
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Thông tin cơ bản</h2>
        
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Tên phương thức <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="VD: Xét tuyển điểm thi ĐGNL"
            value={formData.name}
            onChange={handleBasicInputChange}
            className="border-gray-300"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="code" className="text-sm font-medium">
              Mã phương thức <span className="text-red-500">*</span>
            </Label>
            <Input
              id="code"
              name="code"
              placeholder="VD: DGNL2024"
              value={formData.code}
              onChange={handleBasicInputChange}
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="year" className="text-sm font-medium">
              Năm <span className="text-red-500">*</span>
            </Label>
            <Input
              id="year"
              name="year"
              type="number"
              placeholder="VD: 2024"
              value={formData.year}
              onChange={handleBasicInputChange}
              className="border-gray-300"
            />
          </div>
        </div>
      </Card>

      {/* Danh sách Fields */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Trường dữ liệu</h2>
          <Button
            onClick={addField}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm trường
          </Button>
        </div>

        {formData.fields.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Chưa có trường dữ liệu nào. Hãy bấm "Thêm trường" để bắt đầu.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {formData.fields.map((field, index) => (
              <div
                key={field.id}
                className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Trường {index + 1}
                  </span>
                  <Button
                    onClick={() => removeField(field.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label
                      htmlFor={`label-${field.id}`}
                      className="text-sm font-medium"
                    >
                      Nhãn (Label) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`label-${field.id}`}
                      placeholder="VD: Điểm chuyên môn"
                      value={field.label}
                      onChange={(e) =>
                        updateField(field.id, { label: e.target.value })
                      }
                      className="border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor={`key-${field.id}`}
                      className="text-sm font-medium"
                    >
                      Tên biến (Key) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`key-${field.id}`}
                      placeholder="VD: specialty_score"
                      value={field.key}
                      onChange={(e) =>
                        updateField(field.id, { key: e.target.value })
                      }
                      className="border-gray-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label
                      htmlFor={`type-${field.id}`}
                      className="text-sm font-medium"
                    >
                      Loại dữ liệu <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={field.type}
                      onValueChange={(value) =>
                        updateField(field.id, {
                          type: value as Field['type'],
                        })
                      }
                    >
                      <SelectTrigger id={`type-${field.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Văn bản (text)</SelectItem>
                        <SelectItem value="number">Số (number)</SelectItem>
                        <SelectItem value="file">Tệp (file)</SelectItem>
                        <SelectItem value="select">Chọn danh sách (select)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 flex items-end">
                    <div className="flex items-center gap-2 w-full">
                      <input
                        type="checkbox"
                        id={`required-${field.id}`}
                        checked={field.required}
                        onChange={(e) =>
                          updateField(field.id, { required: e.target.checked })
                        }
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <Label
                        htmlFor={`required-${field.id}`}
                        className="text-sm font-medium cursor-pointer"
                      >
                        Bắt buộc
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Nút hành động */}
      <div className="flex gap-3 justify-end">
        <Button
          variant="outline"
          className="border-gray-300"
          onClick={() =>
            setFormData({
              name: '',
              code: '',
              year: '',
              fields: [],
            })
          }
          disabled={isLoading}
        >
          Xóa tất cả
        </Button>
        <Button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Đang lưu...
            </>
          ) : (
            'Lưu Phương thức'
          )}
        </Button>
      </div>
    </div>
  );
}
