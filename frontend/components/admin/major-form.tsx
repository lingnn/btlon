'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import api from '@/lib/api';

interface MajorFormData {
  name: string;
  code: string;
  totalQuota: number | '';
  duration: number | '';
  year: number | '';
  description: string;
}

export function MajorForm() {
  const [formData, setFormData] = useState<MajorFormData>({
    name: '',
    code: '',
    totalQuota: '',
    duration: '',
    year: '',
    description: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'totalQuota' || name === 'duration' || name === 'year' 
        ? (value === '' ? '' : Number(value)) 
        : value,
    }));
  };

  const handleSave = async () => {
    // Kiểm tra các trường bắt buộc
    if (!formData.name || !formData.code || !formData.totalQuota || !formData.duration || !formData.year) {
      toast.error('Vui lòng điền đầy đủ thông tin ngành.');
      return;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') || localStorage.getItem('token') : null;
    
    if (!token) {
      toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      return;
    }

    // Payload gọn gàng, không còn mảng phương thức phức tạp
    const majorPayload = {
      name: formData.name,
      code: formData.code,
      totalQuota: Number(formData.totalQuota),
      duration: Number(formData.duration),
      year: Number(formData.year),
      description: formData.description,
    };

    setIsSaving(true);
    try {
      await api.major.create(token, majorPayload);
      toast.success('Tạo ngành học thành công');
      // Reset form sau khi lưu
      setFormData({ name: '', code: '', totalQuota: '', duration: '', year: '', description: '' });
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Có lỗi khi tạo ngành học.';
      toast.error(message);
      console.error('Lỗi khi lưu ngành học:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-red-800">Tạo Ngành Học</h1>
        <p className="text-sm text-muted-foreground">Nhập thông tin cơ bản cho ngành đào tạo mới.</p>
      </div>

      <Card className="p-6">
        <CardHeader>
          <CardTitle>Thông tin ngành</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên ngành</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Ví dụ: Công nghệ thông tin" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Mã ngành</Label>
              <Input id="code" name="code" value={formData.code} onChange={handleInputChange} placeholder="Ví dụ: CNTT" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalQuota">Tổng chỉ tiêu</Label>
              <Input
                id="totalQuota"
                name="totalQuota"
                type="number"
                min={0}
                value={formData.totalQuota}
                onChange={handleInputChange}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Thời gian đào tạo (năm)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                min={0}
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="4"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Năm tuyển sinh</Label>
              <Input
                id="year"
                name="year"
                type="number"
                min={2000}
                value={formData.year}
                onChange={handleInputChange}
                placeholder="2026"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Mô tả ngắn gọn về ngành..."
              className="min-h-[120px]"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={isSaving} className="w-full md:w-auto bg-red-800 hover:bg-red-900 text-white">
          {isSaving ? 'Đang lưu...' : 'Lưu ngành học'}
        </Button>
      </div>
    </div>
  );
}