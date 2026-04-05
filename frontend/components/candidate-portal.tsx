'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useAuthStore } from '@/lib/auth-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import api from '@/lib/api';
import { toast } from 'sonner';
import { LogOut, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type ApplicationPreference = {
  priority: number;
  majorId: string;
  methodId: string;
  methodData?: any;
  status?: 'pending' | 'approved' | 'rejected';
  note?: string;
};

type ApplicationDocument = {
  name: string;
  url: string;
  uploadDate?: string;
};

type MajorOption = {
  _id?: string;
  id?: string;
  name: string;
  code: string;
};

type MethodOption = {
  _id?: string;
  id?: string;
  name: string;
  fields?: Array<{
    key: string;
    label: string;
    type: 'text' | 'number' | 'file' | 'date' | 'select';
    required?: boolean;
    options?: string[];
  }>;
};

type ApplicationFormData = {
  userId: string;
  applicationCode: string;
  idNumber: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  highSchool: string;
  graduationYear: number | '';
  preferences: ApplicationPreference[];
  documents: ApplicationDocument[];
  status: 'draft' | 'submitted';
  submissionDate: string | null;
  reviewLog: Array<{
    adminId: string;
    status: string;
    comment: string;
    timestamp: string;
  }>;
};

type MyApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'need_more_info' | 'approved' | 'rejected';

type MyApplicationPreference = {
  priority: number;
  majorId?: { _id?: string; name?: string; code?: string };
  methodId?: { _id?: string; name?: string };
};

type MyApplication = {
  _id: string;
  applicationCode: string;
  status: MyApplicationStatus;
  submissionDate?: string;
  createdAt?: string;
  preferences?: MyApplicationPreference[];
};

export function CandidatePortal() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'submit' | 'status'>('submit');

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [majors, setMajors] = useState<MajorOption[]>([]);
  const [methods, setMethods] = useState<MethodOption[]>([]);
  const [cccdFile, setCccdFile] = useState<File | null>(null);
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<ApplicationFormData>({
    userId: user?.id || '',
    applicationCode: '',
    idNumber: (user as any)?.idNumber || '',
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    highSchool: '',
    graduationYear: '',
    preferences: [],
    documents: [
      { name: 'Minh chứng', url: '' },
      { name: 'Học bạ', url: '' },
    ],
    status: 'draft',
    submissionDate: null,
    reviewLog: [],
  });

  const getAuthToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken') || localStorage.getItem('token');
  };

  const {
    data: myApplications = [],
    isLoading: myAppsLoading,
    error: myAppsError,
  } = useSWR<MyApplication[]>(
    activeTab === 'status' ? 'applications/my' : null,
    async () => {
      const token = getAuthToken();
      if (!token) return [];

      const res = await api.application.getMy(token);
      if (Array.isArray(res)) return res as MyApplication[];
      if (res && typeof res === 'object' && Array.isArray((res as any).data)) return (res as any).data as MyApplication[];
      return [];
    },
    { refreshInterval: 5000 }
  );

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      userId: user?.id || prev.userId,
      fullName: user?.fullName || prev.fullName,
      email: user?.email || prev.email,
      phone: user?.phone || prev.phone,
      idNumber: (user as any)?.idNumber || prev.idNumber,
    }));
  }, [user]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [majorRes, methodRes] = await Promise.all([
          api.major.getAll() as any,
          api.admission.getAllMethods() as any,
        ]);
        setMajors(Array.isArray(majorRes) ? majorRes : majorRes?.data ?? []);
        setMethods(Array.isArray(methodRes) ? methodRes : methodRes?.data ?? []);
      } catch (error) {
        console.error('Failed to load majors/methods', error);
      }
    };
    loadOptions();
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isStep1Valid = () =>
    Boolean(
      formData.fullName.trim() &&
        formData.idNumber.trim() &&
        formData.email.trim() &&
        formData.phone.trim() &&
        formData.highSchool.trim() &&
        formData.graduationYear !== '' &&
        Number(formData.graduationYear) > 0
    );

  const isStep2Valid = () =>
    (formData.preferences || []).some(
      (p) => p.priority > 0 && Boolean(p.majorId?.trim()) && Boolean(p.methodId?.trim())
    ) &&
    (formData.preferences || []).every(
      (p) => p.priority > 0 && Boolean(p.majorId?.trim()) && Boolean(p.methodId?.trim())
    );

  const isStep3Valid = () => Boolean(cccdFile && transcriptFile);

  const canGoNext = () => {
    if (currentStep === 1) return isStep1Valid();
    if (currentStep === 2) return isStep2Valid();
    return false;
  };

  const progressValue = ((currentStep - 1) / 2) * 100;

  const updatePreference = (idx: number, field: keyof ApplicationPreference, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      preferences: (prev.preferences || []).map((pref, i) => (i === idx ? { ...pref, [field]: value } : pref)),
    }));
  };

  const updateMethodDataField = (idx: number, key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      preferences: (prev.preferences || []).map((pref, i) =>
        i === idx
          ? {
              ...pref,
              methodData: {
                ...(pref.methodData || {}),
                [key]: value,
              },
            }
          : pref
      ),
    }));
  };

  const toggleMethodDataOption = (idx: number, key: string, option: string, checked: boolean) => {
    const current = (((formData.preferences || [])[idx]?.methodData || {})[key] || []) as string[];
    const next = checked ? [...current, option] : current.filter((item) => item !== option);
    updateMethodDataField(idx, key, next);
  };

  const addPreference = () => {
    setFormData((prev) => {
      const preferences = prev.preferences || [];
      return {
        ...prev,
        preferences: [
          ...preferences,
          {
            priority: preferences.length + 1,
            majorId: '',
            methodId: '',
            methodData: {},
            status: 'pending',
            note: '',
          },
        ],
      };
    });
  };

  const majorLabelById = (id: string) => {
    const m = majors.find((x) => (x._id || x.id) === id);
    return m ? `${m.name} (${m.code})` : id;
  };

  const methodLabelById = (id: string) => {
    const m = methods.find((x) => (x._id || x.id) === id);
    return m ? m.name : id;
  };

  const handleFinalSubmit = async () => {
    if (!isStep1Valid() || !isStep2Valid() || !isStep3Valid()) return;
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (!token) {
      toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      return;
    }

    const payload = {
      idNumber: formData.idNumber,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      highSchool: formData.highSchool,
      graduationYear: Number(formData.graduationYear),
      status: "submitted",
      preferences: (formData.preferences || []).map((pref) => ({
        priority: pref.priority,
        majorId: pref.majorId,
        methodId: pref.methodId,
        methodData: pref.methodData || {},
      })),
      documents: [
        {
          name: 'Minh chứng',
          url: formData.documents[0]?.url || '',
          uploadDate: new Date().toISOString(),
        },
        {
          name: 'Học bạ',
          url: formData.documents[1]?.url || '',
          uploadDate: new Date().toISOString(),
        },
      ],
    };

    try {
      setIsSubmitting(true);
      const response = await api.application.create(token, payload as any);
      toast.success('Nộp hồ sơ thành công!');
      setFormData((prev) => ({
        ...prev,
        status: 'submitted',
        submissionDate: new Date().toISOString(),
        applicationCode: response?.applicationCode || response?._id || prev.applicationCode,
      }));
      setActiveTab('status');
    } catch (error: any) {
      toast.error(error?.message || 'Nộp hồ sơ thất bại');
    } finally {
      setIsSubmitting(false);
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
              <h1 className="text-xl font-bold text-[#b31f24]">Cổng Thí Sinh PTIT</h1>
              <p className="text-sm text-muted-foreground">Quản Lý Hồ Sơ Tuyển Sinh</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Xin chào, <strong>{user?.fullName}</strong>
            </span>
            <Button variant="outline" size="sm" onClick={() => router.push('/')}>
              Trang chủ
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.push('/majors')}>
              Danh Sách Ngành
            </Button>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Đăng Xuất
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between gap-4 border-b">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('submit')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'submit' ? 'border-b-2 border-[#b31f24] text-[#b31f24]' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Nộp Hồ Sơ
            </button>
            <button
              onClick={() => setActiveTab('status')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'status' ? 'border-b-2 border-[#b31f24] text-[#b31f24]' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Trạng Thái Hồ Sơ
            </button>
          </div>
          <Button variant="outline" onClick={() => router.push('/candidate/account')}>
            Tài khoản &amp; bảo mật
          </Button>
        </div>

        {activeTab === 'submit' && (
          <Card>
            <CardHeader>
              <CardTitle>Nộp hồ sơ online</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span className={currentStep === 1 ? 'font-semibold text-[#b31f24]' : 'text-muted-foreground'}>
                      1. Thông tin cá nhân
                    </span>
                    <span className={currentStep === 2 ? 'font-semibold text-[#b31f24]' : 'text-muted-foreground'}>
                      2. Nguyện vọng
                    </span>
                    <span className={currentStep === 3 ? 'font-semibold text-[#b31f24]' : 'text-muted-foreground'}>
                      3. Minh chứng &amp; Nộp
                    </span>
                  </div>
                  <Progress value={progressValue} />
                </div>

                {currentStep === 1 && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="fullName">Họ tên *</Label>
                      <Input id="fullName" value={formData.fullName} onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="idNumber">CCCD *</Label>
                      <Input id="idNumber" value={formData.idNumber} onChange={(e) => setFormData((p) => ({ ...p, idNumber: e.target.value }))} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Số điện thoại *</Label>
                      <Input id="phone" value={formData.phone} onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="highSchool">Trường cấp 3 *</Label>
                      <Input id="highSchool" value={formData.highSchool} onChange={(e) => setFormData((p) => ({ ...p, highSchool: e.target.value }))} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="graduationYear">Năm tốt nghiệp *</Label>
                      <Input
                        id="graduationYear"
                        type="number"
                        min={2000}
                        value={formData.graduationYear}
                        onChange={(e) => setFormData((p) => ({ ...p, graduationYear: e.target.value === '' ? '' : Number(e.target.value) }))}
                      />
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-medium">Nguyện vọng *</div>
                        <div className="text-sm text-muted-foreground">Có thể thêm/xóa nhiều nguyện vọng.</div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          addPreference()
                        }
                      >
                        <Plus className="h-4 w-4" />
                        Thêm
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {(formData.preferences || []).map((pref, idx) => (
                        <div key={idx} className="rounded-lg border p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <div className="font-medium">Nguyện vọng {idx + 1}</div>
                            {(formData.preferences || []).length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                onClick={() =>
                                  setFormData((p) => ({
                                    ...p,
                                    preferences: (p.preferences || []).filter((_, i) => i !== idx),
                                  }))
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <div className="grid gap-4 md:grid-cols-3">
                            <div className="grid gap-2">
                              <Label>Ưu tiên *</Label>
                              <Input type="number" min={1} value={pref.priority} onChange={(e) => updatePreference(idx, 'priority', Number(e.target.value || 0))} />
                            </div>
                            <div className="grid gap-2">
                              <Label>Chọn ngành *</Label>
                              <Select value={pref.majorId} onValueChange={(value) => updatePreference(idx, 'majorId', value)}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Chọn ngành" />
                                </SelectTrigger>
                                <SelectContent>
                                  {majors.map((m) => {
                                    const id = m._id || m.id || '';
                                    return (
                                      <SelectItem key={id} value={id}>
                                        {m.name} ({m.code})
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <Label>Chọn phương thức *</Label>
                              <Select
                                value={pref.methodId}
                                onValueChange={(value) => {
                                  updatePreference(idx, 'methodId', value);
                                  setFormData((prev) => ({
                                    ...prev,
                                    preferences: (prev.preferences || []).map((item, i) =>
                                      i === idx ? { ...item, methodData: {} } : item
                                    ),
                                  }));
                                }}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Chọn phương thức" />
                                </SelectTrigger>
                                <SelectContent>
                                  {methods.map((m) => {
                                    const id = m._id || m.id || '';
                                    return (
                                      <SelectItem key={id} value={id}>
                                        {m.name}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {(() => {
                            const selectedMethod = methods.find((m) => (m._id || m.id) === pref.methodId);
                            const methodFields = selectedMethod?.fields || [];
                            if (!methodFields.length) return null;

                            return (
                              <div className="mt-4 space-y-3 rounded-md border bg-muted/20 p-3">
                                <p className="text-sm font-medium">Thông tin bổ sung theo phương thức</p>
                                {methodFields.map((field) => {
                                  const fieldKey = field.key;
                                  const fieldValue = (pref.methodData || {})[fieldKey];

                                  if (field.type === 'select') {
                                    const options = Array.isArray(field.options) ? field.options : [];
                                    return (
                                      <div key={fieldKey} className="space-y-2">
                                        <Label>{field.label}{field.required ? ' *' : ''}</Label>
                                        <div className="grid gap-2 md:grid-cols-2">
                                          {options.map((opt) => {
                                            const checked = Array.isArray(fieldValue) && fieldValue.includes(opt);
                                            return (
                                              <label key={opt} className="flex items-center gap-2 text-sm">
                                                <Checkbox
                                                  checked={checked}
                                                  onCheckedChange={(state) =>
                                                    toggleMethodDataOption(idx, fieldKey, opt, Boolean(state))
                                                  }
                                                />
                                                <span>{opt}</span>
                                              </label>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    );
                                  }

                                  if (field.type === 'file') {
                                    return (
                                      <div key={fieldKey} className="grid gap-2">
                                        <Label>{field.label}{field.required ? ' *' : ''}</Label>
                                        <Input
                                          type="file"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0] || null;
                                            updateMethodDataField(idx, fieldKey, file ? file.name : '');
                                          }}
                                        />
                                        {fieldValue ? (
                                          <p className="text-xs text-muted-foreground">Da chon: {String(fieldValue)}</p>
                                        ) : null}
                                      </div>
                                    );
                                  }

                                  return (
                                    <div key={fieldKey} className="grid gap-2">
                                      <Label>{field.label}{field.required ? ' *' : ''}</Label>
                                      <Input
                                        type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                                        value={fieldValue || ''}
                                        onChange={(e) => updateMethodDataField(idx, fieldKey, e.target.value)}
                                        placeholder={`Nhập ${field.label.toLowerCase()}`}
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })()}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="cccdUpload">Upload minh chứng *</Label>
                        <Input
                          id="cccdUpload"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setCccdFile(file);
                            setFormData((prev) => ({
                              ...prev,
                              documents: prev.documents.map((doc, i) =>
                                i === 0 ? { ...doc, name: 'Minh chứng', url: file ? URL.createObjectURL(file) : '' } : doc
                              ),
                            }));
                          }}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="transcriptUpload">Upload học bạ *</Label>
                        <Input
                          id="transcriptUpload"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setTranscriptFile(file);
                            setFormData((prev) => ({
                              ...prev,
                              documents: prev.documents.map((doc, i) =>
                                i === 1 ? { ...doc, name: 'Học bạ', url: file ? URL.createObjectURL(file) : '' } : doc
                              ),
                            }));
                          }}
                        />
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <h4 className="mb-3 font-semibold">Bảng tóm tắt hồ sơ</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Trường dữ liệu</TableHead>
                            <TableHead>Giá trị</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow><TableCell>Họ tên</TableCell><TableCell>{formData.fullName}</TableCell></TableRow>
                          <TableRow><TableCell>CCCD</TableCell><TableCell>{formData.idNumber}</TableCell></TableRow>
                          <TableRow><TableCell>Email</TableCell><TableCell>{formData.email}</TableCell></TableRow>
                          <TableRow><TableCell>Số điện thoại</TableCell><TableCell>{formData.phone}</TableCell></TableRow>
                          <TableRow><TableCell>Trường cấp 3</TableCell><TableCell>{formData.highSchool}</TableCell></TableRow>
                          <TableRow><TableCell>Năm tốt nghiệp</TableCell><TableCell>{formData.graduationYear}</TableCell></TableRow>
                          {(formData.preferences || []).map((pref, idx) => (
                            <TableRow key={`${idx}-${pref.majorId}-${pref.methodId}`}>
                              <TableCell>Nguyện vọng {idx + 1}</TableCell>
                              <TableCell>
                                {majorLabelById(pref.majorId)} - {methodLabelById(pref.methodId)} (Ưu tiên: {pref.priority})
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow><TableCell>Minh chứng</TableCell><TableCell>{cccdFile?.name || 'Chưa tải lên'}</TableCell></TableRow>
                          <TableRow><TableCell>Học bạ</TableCell><TableCell>{transcriptFile?.name || 'Chưa tải lên'}</TableCell></TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <Button type="button" variant="outline" onClick={() => setCurrentStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s))} disabled={currentStep === 1}>
                    Quay lại
                  </Button>

                  {currentStep < 3 ? (
                    canGoNext() ? (
                      <Button type="button" className="bg-[#b31f24] hover:bg-[#8f191d]" onClick={() => setCurrentStep((s) => (s < 3 ? ((s + 1) as 1 | 2 | 3) : s))}>
                        Tiếp theo
                      </Button>
                    ) : null
                  ) : (
                    <Button
                      type="button"
                      className="bg-[#b31f24] hover:bg-[#8f191d]"
                      onClick={handleFinalSubmit}
                      disabled={!isStep3Valid() || isSubmitting}
                    >
                      {isSubmitting ? 'Đang nộp...' : 'Xác nhận nộp hồ sơ'}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'status' && (
          <Card>
            <CardHeader>
              <CardTitle>Trạng Thái Hồ Sơ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myAppsLoading ? (
                  <div className="text-sm text-muted-foreground">Đang tải trạng thái hồ sơ...</div>
                ) : myAppsError ? (
                  <div className="text-sm text-red-600">Không thể tải trạng thái hồ sơ</div>
                ) : myApplications.length === 0 ? (
                  <div className="text-sm text-muted-foreground">Bạn chưa có hồ sơ.</div>
                ) : (
                  myApplications.map((app) => {
                    const submittedAt = app.submissionDate || app.createdAt;
                    const dateText = submittedAt ? new Date(submittedAt).toLocaleDateString('vi-VN') : '-';

                    const program =
                      app.preferences?.[0]?.majorId?.name ||
                      app.applicationCode ||
                      '-';

                    const status = app.status;
                    const badgeClass =
                      status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : status === 'under_review'
                            ? 'bg-amber-100 text-amber-700'
                            : status === 'submitted'
                              ? 'bg-amber-100 text-amber-700'
                              : status === 'need_more_info'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-700';

                    const label =
                      status === 'approved'
                        ? 'Trúng tuyển'
                        : status === 'rejected'
                          ? 'Từ chối'
                          : status === 'under_review'
                            ? 'Đang duyệt'
                            : status === 'submitted'
                              ? 'Đang duyệt'
                              : status === 'need_more_info'
                                ? 'Cần bổ sung'
                                : 'Nháp';

                    return (
                      <div
                        key={app._id}
                        className="flex items-center justify-between rounded-lg border border-border p-4"
                      >
                        <div>
                          <h4 className="font-medium">{program}</h4>
                          <p className="text-sm text-muted-foreground">Nộp ngày: {dateText}</p>
                        </div>
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${badgeClass}`}>
                          {label}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
