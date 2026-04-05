'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Upload, FileText, ArrowRight, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function ApplicationForm() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    program: '',
    highSchool: '',
    address: '',
    phoneNumber: '',
    gpa: '',
    essay: '',
  });

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Application submitted:', formData);
    alert('Hồ sơ của bạn đã được nộp thành công!');
    router.push('/candidate/portal');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#b31f24]">
              <span className="text-lg font-bold text-white">P</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#b31f24]">Nộp Hồ Sơ</h1>
              <p className="text-sm text-muted-foreground">Cổng Tuyển Sinh PTIT</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Xin chào, <strong>{user?.fullName}</strong>
            </span>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Đăng Xuất
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <div className="mb-8 flex items-center justify-between">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-white transition-colors ${
                  step <= currentStep ? 'bg-[#b31f24]' : 'bg-muted'
                }`}
              >
                {step}
              </div>
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                {step === 1 && 'Thông Tin'}
                {step === 2 && 'Chứng Chỉ'}
                {step === 3 && 'Xác Nhận'}
              </p>
            </div>
          ))}
        </div>

        {/* Form */}
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && 'Bước 1: Thông Tin Cơ Bản'}
              {currentStep === 2 && 'Bước 2: Thông Tin Học Tập'}
              {currentStep === 3 && 'Bước 3: Xác Nhận Hồ Sơ'}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Chọn Chương Trình</label>
                    <select
                      name="program"
                      value={formData.program}
                      onChange={handleInputChange}
                      className="mt-2 w-full rounded-lg border border-input px-3 py-2"
                      required
                    >
                      <option value="">-- Chọn chương trình --</option>
                      <option value="it">Công Nghệ Thông Tin</option>
                      <option value="telecom">Kĩ thuật Điện tử Viễn thông</option>
                      <option value="electronics">Công Nghệ Kĩ Thuật Điện, Điện Tử</option>
                      <option value="multimedia">Công Nghệ Đa Phương Tiện</option>
                      <option value="business">Quản Trị Kinh Doanh</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Trường Cấp 3</label>
                    <Input
                      type="text"
                      name="highSchool"
                      placeholder="Tên trường cấp 3"
                      value={formData.highSchool}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Địa Chỉ</label>
                    <Input
                      type="text"
                      name="address"
                      placeholder="Địa chỉ hiện tại"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Số Điện Thoại Liên Hệ</label>
                    <Input
                      type="tel"
                      name="phoneNumber"
                      placeholder="Số điện thoại"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Academic Info */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Điểm GPA / Điểm Trung Bình</label>
                    <Input
                      type="number"
                      name="gpa"
                      placeholder="VD: 3.75"
                      step="0.01"
                      min="0"
                      max="4"
                      value={formData.gpa}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Thư Giới Thiệu / Lý Do Chọn Chương Trình</label>
                    <textarea
                      name="essay"
                      placeholder="Viết lý do bạn chọn chương trình này (tối thiểu 50 từ)"
                      value={formData.essay}
                      onChange={handleInputChange}
                      rows={5}
                      className="mt-2 w-full rounded-lg border border-input px-3 py-2"
                      required
                    />
                  </div>

                  <div className="rounded-lg border-2 border-dashed border-border p-8 text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm font-medium">Tải lên Bảng Điểm (PDF)</p>
                    <p className="text-xs text-muted-foreground">Chọn file từ máy tính</p>
                    <Input type="file" accept=".pdf" className="mt-4" />
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="rounded-lg bg-blue-50 p-4">
                    <h4 className="font-medium text-blue-900 mb-3">Tóm Tắt Hồ Sơ</h4>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Chương Trình:</dt>
                        <dd className="font-medium">
                          {formData.program === 'it'
                            ? 'Công Nghệ Thông Tin'
                            : formData.program === 'telecom'
                              ? 'Kĩ thuật Điện tử Viễn thông'
                              : formData.program === 'electronics'
                                ? 'Công Nghệ Kĩ Thuật Điện, Điện Tử'
                                : formData.program === 'multimedia'
                                  ? 'Công Nghệ Đa Phương Tiện'
                                  : 'Quản Trị Kinh Doanh'}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Trường:</dt>
                        <dd className="font-medium">{formData.highSchool}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">GPA:</dt>
                        <dd className="font-medium">{formData.gpa}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Địa Chỉ:</dt>
                        <dd className="font-medium">{formData.address}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Số Điện Thoại:</dt>
                        <dd className="font-medium">{formData.phoneNumber}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <p className="text-sm text-green-900">
                      <strong>Xác Nhận:</strong> Tôi cam đoan rằng tất cả thông tin trên là chính xác
                      và đầy đủ. Tôi chịu trách nhiệm pháp lý nếu cung cấp thông tin sai lệch.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreviousStep}
                  disabled={currentStep === 1}
                >
                  Quay Lại
                </Button>

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-[#b31f24] hover:bg-[#8f191d]"
                  >
                    Tiếp Tục
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    <FileText className="mr-2 h-4 w-4" />
                    Nộp Hồ Sơ
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
