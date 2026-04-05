'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { admissionAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { LogOut, Upload, Check, ChevronRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type FormStep = 'info' | 'documents' | 'confirm';

interface AdmissionMethod {
  _id?: string;
  id?: string;
  name: string;
  quota: number;
}

interface ApplicationFormData {
  methodId: string;
  program: string;
  highSchool: string;
  address: string;
  phone: string;
  file: File | null;
}

export function SubmitApplicationForm() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [currentStep, setCurrentStep] = useState<FormStep>('info');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingMethods, setIsLoadingMethods] = useState(true);
  const [methods, setMethods] = useState<AdmissionMethod[]>([]);
  const [formData, setFormData] = useState<ApplicationFormData>({
    methodId: '',
    program: '',
    highSchool: '',
    address: '',
    phone: user?.phone || '',
    file: null,
  });

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        setIsLoadingMethods(true);
        const response = await admissionAPI.getAllMethods();
        setMethods(response.data || []);
        console.log('[v0] Fetched admission methods:', response.data);
      } catch (error) {
        console.error('[v0] Failed to fetch methods:', error);
        alert('Lỗi: Không thể tải danh sách phương thức tuyển sinh');
      } finally {
        setIsLoadingMethods(false);
      }
    };
    
    fetchMethods();
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setFormData(prev => ({ ...prev, file }));
    } else {
      alert('Vui lòng chọn file PDF');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.methodId || !formData.highSchool || !formData.phone || !formData.file) {
      alert('Vui lòng điền đủ thông tin');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('methodId', formData.methodId);
      formDataToSend.append('program', formData.program);
      formDataToSend.append('highSchool', formData.highSchool);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('file', formData.file);

      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Không tìm thấy token xác thực');

      await admissionAPI.submitApplication(token, formDataToSend);
      alert('Hồ sơ đã được nộp thành công!');
      router.push('/candidate/portal');
    } catch (error) {
      console.error('[v0] Submission error:', error);
      alert('Lỗi: Không thể nộp hồ sơ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedMethod = methods.find(m => m._id === formData.methodId || m.id === formData.methodId);
  const stepProgress = currentStep === 'info' ? 33 : currentStep === 'documents' ? 66 : 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-20">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#b31f24]">
              <span className="text-lg font-bold text-white">P</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#b31f24]">Nộp Hồ Sơ Online</h1>
              <p className="text-xs text-muted-foreground">Điền đầy đủ thông tin để hoàn tất</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.fullName}
            </span>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Đăng Xuất
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold">Tiến Độ Nộp Hồ Sơ</h2>
            <span className="text-xs font-semibold text-muted-foreground">{stepProgress}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#b31f24] transition-all duration-300 ease-out"
              style={{ width: `${stepProgress}%` }}
            />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Steps Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Các Bước</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { id: 'info', label: 'Thông Tin Cơ Bản' },
                  { id: 'documents', label: 'Tải Lên Tài Liệu' },
                  { id: 'confirm', label: 'Xác Nhận' },
                ].map((step, idx) => (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(step.id as FormStep)}
                    className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
                      currentStep === step.id
                        ? 'bg-[#b31f24]/10 text-[#b31f24] font-semibold'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      currentStep === step.id 
                        ? 'bg-[#b31f24] text-white' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {idx + 1}
                    </div>
                    {step.label}
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Form Content */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>
                {currentStep === 'info' && 'Thông Tin Cơ Bản'}
                {currentStep === 'documents' && 'Tải Lên Tài Liệu'}
                {currentStep === 'confirm' && 'Xác Nhận Hồ Sơ'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Basic Info */}
                {currentStep === 'info' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold">Phương Thức Tuyển Sinh <span className="text-red-500">*</span></label>
                      {isLoadingMethods ? (
                        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Đang tải...
                        </div>
                      ) : (
                        <select
                          name="methodId"
                          value={formData.methodId}
                          onChange={handleInputChange}
                          className="mt-2 w-full rounded-lg border border-input px-3 py-2 text-sm"
                          required
                        >
                          <option value="">-- Chọn phương thức tuyển sinh --</option>
                          {methods.map(method => (
                            <option key={method._id || method.id} value={method._id || method.id || ''}>
                              {method.name} (Chỉ tiêu: {method.quota})
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-semibold">Tên Chương Trình <span className="text-red-500">*</span></label>
                      <Input
                        name="program"
                        placeholder="Tên chương trình học"
                        value={formData.program}
                        onChange={handleInputChange}
                        required
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold">Trường Cấp 3 <span className="text-red-500">*</span></label>
                      <Input
                        name="highSchool"
                        placeholder="Tên trường cấp 3"
                        value={formData.highSchool}
                        onChange={handleInputChange}
                        required
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold">Số Điện Thoại <span className="text-red-500">*</span></label>
                      <Input
                        name="phone"
                        placeholder="Số điện thoại"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold">Địa Chỉ</label>
                      <Input
                        name="address"
                        placeholder="Địa chỉ hiện tại"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="mt-2"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Documents */}
                {currentStep === 'documents' && (
                  <div className="space-y-4">
                    <div className="p-6 border-2 border-dashed rounded-lg text-center hover:bg-muted/50 transition-colors">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm font-semibold mb-1">Tải lên hồ sơ PDF</p>
                      <p className="text-xs text-muted-foreground mb-4">Kéo thả hoặc chọn file từ máy tính</p>
                      <Input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        required
                      />
                      {formData.file && (
                        <p className="text-xs text-green-600 mt-2">✓ {formData.file.name}</p>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      • Tệp phải là PDF
                      <br />
                      • Dung lượng tối đa: 10MB
                      <br />
                      • Bao gồm: Hóa đơn, chứng chỉ, thành tích học tập
                    </p>
                  </div>
                )}

                {/* Step 3: Confirm */}
                {currentStep === 'confirm' && (
                  <div className="space-y-4">
                    <Card className="bg-muted/50 border-0">
                      <CardContent className="pt-6 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Phương Thức:</span>
                          <span className="font-semibold">{selectedMethod?.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Chương Trình:</span>
                          <span className="font-semibold">{formData.program}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Trường Cấp 3:</span>
                          <span className="font-semibold">{formData.highSchool}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Số Điện Thoại:</span>
                          <span className="font-semibold">{formData.phone}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Tài Liệu:</span>
                          <span className="font-semibold text-green-600 flex items-center gap-1">
                            <Check className="h-4 w-4" />
                            {formData.file?.name}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                    <p className="text-xs text-muted-foreground">
                      Bằng cách nộp hồ sơ, bạn xác nhận rằng tất cả thông tin đã cung cấp là chính xác và hoàn chỉnh.
                    </p>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-3 pt-6 border-t">
                  {currentStep !== 'info' && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (currentStep === 'documents') setCurrentStep('info');
                        if (currentStep === 'confirm') setCurrentStep('documents');
                      }}
                    >
                      Quay Lại
                    </Button>
                  )}
                  
                  {currentStep !== 'confirm' && (
                    <Button
                      type="button"
                      onClick={() => {
                        if (currentStep === 'info' && formData.methodId && formData.program && formData.highSchool && formData.phone) {
                          setCurrentStep('documents');
                        } else if (currentStep === 'documents' && formData.file) {
                          setCurrentStep('confirm');
                        }
                      }}
                      className="ml-auto bg-[#b31f24] hover:bg-[#8f191d] gap-2"
                    >
                      Tiếp Tục
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}

                  {currentStep === 'confirm' && (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="ml-auto bg-green-600 hover:bg-green-700 gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          Nộp Hồ Sơ
                          <Check className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
