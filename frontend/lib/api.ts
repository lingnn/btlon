'use client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

interface LoginPayload {
  username: string;
  password: string;
}

interface RegisterPayload {
  username: string;
  email: string;
  fullName: string;
  phone: string;
  idNumber: string;
  password: string;
  role: 'candidate' | 'admin';
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      username: string;
      email: string;
      fullName: string;
      role: 'admin' | 'candidate';
    };
    token: string;
  };
}

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

interface UpdateProfilePayload {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface AdminUser {
  _id: string;
  username: string;
  fullName?: string;
  email?: string;
  phone?: string;
  idNumber?: string;
  role: 'admin' | 'candidate';
  createdAt?: string;
  updatedAt?: string;
}

export interface UserSummary {
  totalUsers: number;
  totalAdmins: number;
  totalCandidates: number;
}

export interface UserApplicationPreference {
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
  status?: 'pending' | 'approved' | 'rejected';
  note?: string;
}

export interface UserApplication {
  _id: string;
  applicationCode: string;
  fullName?: string;
  email?: string;
  phone?: string;
  idNumber?: string;
  status: 'draft' | 'submitted' | 'under_review' | 'need_more_info' | 'approved' | 'rejected';
  submissionDate?: string;
  createdAt?: string;
  preferences?: UserApplicationPreference[];
}

export interface UserDetailResponse {
  user: AdminUser;
  applications: UserApplication[];
}

interface ArticleAuthor {
  _id?: string;
  fullName?: string;
  email?: string;
}

interface ArticleAttachment {
  name?: string;
  url?: string;
}

interface Article {
  _id: string;
  title: string;
  content?: string;
  category?: string;
  tags?: string[];
  attachments?: ArticleAttachment[];
  authorId?: string | ArticleAuthor;
  isPublished: boolean;
  publishedAt?: string | null;
  viewCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface AdmissionMethod {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  quota?: number;
  requirements?: string[];
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ApplicationSubmission {
  methodId: string;
  program: string;
  highSchool: string;
  address: string;
  phone: string;
  file: File;
}

interface Application {
  id: string;
  candidateName: string;
  email: string;
  status: 'Đang duyệt' | 'Trúng tuyển' | 'Từ chối';
  submittedDate: string;
  program: string;
}

interface AdminStats {
  totalCandidates: number;
  newApplications: number;
  approvalRate: number;
  applications: Application[];
}

interface ApplicationPayload {
  idNumber: string;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  highSchool: string;
  graduationYear: number;
  preferences: Array<{
    priority: number;
    majorId: string;
    methodId: string;
    methodData?: Record<string, any>;
  }>;
  documents: Array<{
    name: string;
    url: string;
    uploadDate?: string;
  }>;
}

type StatisticType = 'by_major' | 'by_status' | 'monthly_submission';

type ByMajorItem = {
  majorCode?: string;
  majorName?: string;
  count: number;
  submittedCount?: number;
  acceptedCount?: number;
};

type ByStatusData = {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
};

type OverviewStats = {
  totals: ByStatusData;
  statusDistribution: Array<{ name: 'Approved' | 'Pending' | 'Rejected'; value: number }>;
  topMajors: Array<{ name: string; count: number; submittedCount: number; acceptedCount: number }>;
};

export const authAPI = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Đăng nhập thất bại');
    return response.json();
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      let errorMessage = 'Đăng kí thất bại';
      try {
        const errorData = await response.json();
        if (errorData?.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // Keep default message when response is not JSON.
      }
      throw new Error(errorMessage);
    }
    return response.json();
  },

  getMe: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Lấy thông tin người dùng thất bại');
    return response.json();
  },

  updateMe: async (token: string, payload: UpdateProfilePayload) => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMessage = 'Cập nhật thông tin thất bại';
      try {
        const errorData = await response.json();
        if (errorData?.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // Keep default error message.
      }
      throw new Error(errorMessage);
    }

    return response.json();
  },

  changePassword: async (token: string, payload: ChangePasswordPayload): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/users/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMessage = 'Đổi mật khẩu thất bại';
      try {
        const errorData = await response.json();
        if (errorData?.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // Keep default error message.
      }
      throw new Error(errorMessage);
    }

    return response.json();
  },
};

export const admissionAPI = {
  // Admission Methods (Public & Admin)
  getAllMethods: async (): Promise<{ data: AdmissionMethod[] }> => {
    const response = await fetch(`${API_BASE_URL}/admission-methods`);
    if (!response.ok) throw new Error('Lấy danh sách phương thức tuyển sinh thất bại');
    return response.json();
  },

  getMethodById: async (methodId: string): Promise<{ data: AdmissionMethod }> => {
    const response = await fetch(`${API_BASE_URL}/admission-methods/${methodId}`);
    if (!response.ok) throw new Error('Lấy thông tin phương thức thất bại');
    return response.json();
  },

  createMethod: async (token: string, method: AdmissionMethod): Promise<{ data: AdmissionMethod }> => {
    const response = await fetch(`${API_BASE_URL}/admission-methods`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(method),
    });
    if (!response.ok) throw new Error('Tạo phương thức tuyển sinh thất bại');
    return response.json();
  },

  updateMethod: async (token: string, methodId: string, method: Partial<AdmissionMethod>): Promise<{ data: AdmissionMethod }> => {
    const response = await fetch(`${API_BASE_URL}/admission-methods/${methodId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(method),
    });
    if (!response.ok) throw new Error('Cập nhật phương thức thất bại');
    return response.json();
  },

  deleteMethod: async (token: string, methodId: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/admission-methods/${methodId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Xóa phương thức thất bại');
    return response.json();
  },

  toggleMethodActive: async (token: string, methodId: string): Promise<{ data: AdmissionMethod }> => {
    const response = await fetch(`${API_BASE_URL}/admission-methods/${methodId}/toggle`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Cập nhật trạng thái phương thức thất bại');
    return response.json();
  },

  // Application Submissions
  submitApplication: async (token: string, data: FormData): Promise<{ data: Application }> => {
    const response = await fetch(`${API_BASE_URL}/admissionMethods/apply`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: data,
    });
    if (!response.ok) throw new Error('Nộp hồ sơ thất bại');
    return response.json();
  },

  // Admin Stats
  getAdminStats: async (token: string): Promise<AdminStats> => {
    const response = await fetch(`${API_BASE_URL}/admissionMethods/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Lấy thống kê thất bại');
    return response.json();
  },

  getApplications: async (token: string): Promise<Application[]> => {
    const response = await fetch(`${API_BASE_URL}/admissionMethods/applications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Lấy danh sách hồ sơ thất bại');
    return response.json();
  },

  approveApplication: async (token: string, applicationId: string): Promise<{ data: Application }> => {
    const response = await fetch(`${API_BASE_URL}/admissionMethods/${applicationId}/approve`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Duyệt hồ sơ thất bại');
    return response.json();
  },

  rejectApplication: async (token: string, applicationId: string): Promise<{ data: Application }> => {
    const response = await fetch(`${API_BASE_URL}/admissionMethods/${applicationId}/reject`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Từ chối hồ sơ thất bại');
    return response.json();
  },
};

interface Major {
  _id?: string;
  id?: string;
  code: string;
  name: string;
  totalQuota: number;
  duration: number;
  year: number;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const majorAPI = {
  getAll: async (): Promise<{ data: Major[] }> => {
    const response = await fetch(`${API_BASE_URL}/majors`);
    if (!response.ok) throw new Error('Lấy danh sách ngành thất bại');
    return response.json();
  },

  create: async (token: string, majorData: Omit<Major, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Promise<{ data: Major }> => {
    const response = await fetch(`${API_BASE_URL}/majors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(majorData),
    });

    if (!response.ok) throw new Error('Tạo ngành thất bại');
    return response.json();
  },

  update: async (token: string, id: string, majorData: Partial<Major>): Promise<{ data: Major }> => {
    const response = await fetch(`${API_BASE_URL}/majors/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(majorData),
    });

    if (!response.ok) throw new Error('Cập nhật ngành thất bại');
    return response.json();
  },

  delete: async (token: string, id: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/majors/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error('Xóa ngành thất bại');
    return response.json();
  },
};

export const applicationAPI = {
  create: async (token: string, payload: ApplicationPayload) => {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const body = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(body?.message || 'Tạo hồ sơ thất bại');
    }
    return body;
  },

  // Candidate: GET /api/applications/my
  getMy: async (token: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/applications/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error('Lấy danh sách hồ sơ thất bại');
    return response.json();
  },

  // Admin
  // GET /api/applications?status=&majorId=&methodId=&year=&page=&limit=
  getAll: async (
    token: string,
    params?: {
      status?: string;
      page?: number;
      limit?: number;
      majorId?: string;
      methodId?: string;
      year?: number | string;
    }
  ): Promise<any> => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.majorId) searchParams.set('majorId', params.majorId);
    if (params?.methodId) searchParams.set('methodId', params.methodId);
    if (params?.year !== undefined) searchParams.set('year', String(params.year));
    searchParams.set('page', String(params?.page ?? 1));
    searchParams.set('limit', String(params?.limit ?? 10));

    const response = await fetch(`${API_BASE_URL}/applications?${searchParams.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error('Lấy danh sách hồ sơ thất bại');
    return response.json();
  },
};

type ArticleListParams = {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  published?: string;
};

export const articleAPI = {
  getAll: async (
    tokenOrParams?: string | ArticleListParams,
    maybeParams?: ArticleListParams
  ): Promise<{ data: Article[]; total: number; page: number; limit: number }> => {
    const token = typeof tokenOrParams === 'string' ? tokenOrParams : undefined;
    const params = typeof tokenOrParams === 'string' ? maybeParams : tokenOrParams;

    const searchParams = new URLSearchParams();
    searchParams.set('page', String(params?.page ?? 1));
    searchParams.set('limit', String(params?.limit ?? 12));
    if (params?.category) searchParams.set('category', params.category);
    if (params?.tag) searchParams.set('tag', params.tag);
    searchParams.set('published', params?.published ?? 'true');

    const response = await fetch(`${API_BASE_URL}/articles?${searchParams.toString()}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    if (!response.ok) throw new Error('Lấy danh sách tin tức thất bại');
    return response.json();
  },

  getById: async (id: string): Promise<Article> => {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`);
    const body = await response.json().catch(() => null);
    if (!response.ok) throw new Error(body?.message || 'Lấy chi tiết bài viết thất bại');
    return body;
  },

  publish: async (token: string, id: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/articles/${id}/publish`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });

    const body = await response.json().catch(() => null);
    if (!response.ok) throw new Error(body?.message || 'Xuất bản bài viết thất bại');
    return body;
  },

  unpublish: async (token: string, id: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/articles/${id}/unpublish`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });

    const body = await response.json().catch(() => null);
    if (!response.ok) throw new Error(body?.message || 'Gỡ bài thất bại');
    return body;
  },

  create: async (
    token: string,
    payload: {
      title: string;
      content?: string;
      category?: string;
      tags?: string[];
      attachments?: { name?: string; url?: string }[];
    }
  ): Promise<Article> => {
    const response = await fetch(`${API_BASE_URL}/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const body = await response.json().catch(() => null);
    if (!response.ok) throw new Error(body?.message || 'Tạo bài viết thất bại');
    return body;
  },

  delete: async (token: string, id: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    const body = await response.json().catch(() => null);
    if (!response.ok) throw new Error(body?.message || 'Xóa bài thất bại');
    return body;
  },
};

const statisticAPI = {
  getByType: async <T = any>(token: string, type: StatisticType): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}/statistics/${type}?realtime=true`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const body = await response.json().catch(() => null);
    if (!response.ok) throw new Error(body?.message || 'Lấy thống kê thất bại');

    return ((body && body.data) || body) as T;
  },

  getStats: async (token: string, type: 'overview' | StatisticType = 'overview'): Promise<OverviewStats | any> => {
    if (type !== 'overview') {
      return statisticAPI.getByType(token, type);
    }

    const [byStatusRaw, byMajorRaw] = await Promise.all([
      statisticAPI.getByType<ByStatusData>(token, 'by_status'),
      statisticAPI.getByType<ByMajorItem[]>(token, 'by_major'),
    ]);

    const totals: ByStatusData = {
      total: Number(byStatusRaw?.total || 0),
      approved: Number(byStatusRaw?.approved || 0),
      pending: Number(byStatusRaw?.pending || 0),
      rejected: Number(byStatusRaw?.rejected || 0),
    };

    const statusDistribution = [
      { name: 'Approved' as const, value: totals.approved },
      { name: 'Pending' as const, value: totals.pending },
      { name: 'Rejected' as const, value: totals.rejected },
    ];

    const topMajors = (Array.isArray(byMajorRaw) ? byMajorRaw : [])
      .filter((item) => Number(item?.count || 0) > 0)
      .sort((a, b) => Number(b.count || 0) - Number(a.count || 0))
      .slice(0, 10)
      .map((item) => ({
        name: item.majorName || item.majorCode || 'Chưa rõ ngành',
        count: Number(item.count || 0),
        submittedCount: Number(item.submittedCount ?? item.count ?? 0),
        acceptedCount: Number(item.acceptedCount || 0),
      }));

    return {
      totals,
      statusDistribution,
      topMajors,
    };
  },

  generate: async (token: string, year?: number): Promise<{ message: string; year?: number }> => {
    const response = await fetch(`${API_BASE_URL}/statistics/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(year ? { year } : {}),
    });

    const body = await response.json().catch(() => null);
    if (!response.ok) throw new Error(body?.message || 'Cập nhật thống kê thất bại');

    return body;
  },
};

const userAPI = {
  getAll: async (token: string): Promise<AdminUser[]> => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const body = await response.json().catch(() => null);
    if (!response.ok) throw new Error(body?.message || 'Lấy danh sách người dùng thất bại');

    return Array.isArray(body) ? body : [];
  },

  getSummary: async (token: string): Promise<UserSummary> => {
    const response = await fetch(`${API_BASE_URL}/users/summary`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const body = await response.json().catch(() => null);
    if (!response.ok) throw new Error(body?.message || 'Lấy tổng quan người dùng thất bại');

    return {
      totalUsers: Number(body?.totalUsers || 0),
      totalAdmins: Number(body?.totalAdmins || 0),
      totalCandidates: Number(body?.totalCandidates || 0),
    };
  },

  getDetail: async (token: string, userId: string): Promise<UserDetailResponse> => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/detail`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const body = await response.json().catch(() => null);
    if (!response.ok) throw new Error(body?.message || 'Lấy chi tiết người dùng thất bại');

    return {
      user: body?.user,
      applications: Array.isArray(body?.applications) ? body.applications : [],
    };
  },
};

// Gom 2 đối tượng vào làm 1
const api = {
  auth: authAPI,
  admission: admissionAPI,
  major: majorAPI,
  application: applicationAPI,
  article: articleAPI,
  statistic: statisticAPI,
  users: userAPI,
};

export default api;
