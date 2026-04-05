# Hệ Thống Phân Quyền Tuyển Sinh PTIT - Hướng Dẫn Sử Dụng

## 🎯 Tổng Quan Hệ Thống

Hệ thống này cung cấp một nền tảng tuyển sinh hoàn chỉnh với phân quyền theo vai trò (Role-Based Access Control).

## 📋 Các Vai Trò và Quyền Hạn

### 1. **Khách Truy Cập (Chưa Đăng Nhập)**
- ✅ Xem trang chủ, thông tin tuyển sinh
- ✅ Xem các hướng dẫn công khai
- ❌ Nộp hồ sơ (yêu cầu đăng nhập)
- ❌ Xem trạng thái hồ sơ (yêu cầu đăng nhập)

**Hành động:**
- Nhấn "Đăng Nhập / Đăng Kí" → Mở modal xác thực
- Nhấn "Nộp Hồ Sơ Online" → Chuyển hướng đến trang đăng nhập

### 2. **Thí Sinh (Candidate - role: 'candidate')**
- ✅ Truy cập Cổng Thí Sinh
- ✅ Nộp hồ sơ online
- ✅ Xem trạng thái hồ sơ (Đang duyệt / Trúng tuyển)
- ✅ Cập nhật thông tin cá nhân
- ❌ Xem Admin Dashboard

**Hành động:**
- Đăng nhập → Navbar hiển thị nút "Nộp Hồ Sơ Online"
- Nhấn "Nộp Hồ Sơ Online" → Chuyển đến trang `/candidate/portal`
- Tại đây có 3 tabs: 
  - **Thông Tin Cá Nhân**: Xem/cập nhật info
  - **Nộp Hồ Sơ**: Form nộp multi-step (3 bước)
  - **Trạng Thái Hồ Sơ**: Xem danh sách hồ sơ đã nộp

### 3. **Quản Trị Viên (Admin - role: 'admin')**
- ✅ Truy cập Admin Dashboard
- ✅ Xem thống kê:
  - Tổng số thí sinh
  - Hồ sơ mới chưa duyệt
  - Tỷ lệ trúng tuyển
- ✅ Xem danh sách hồ sơ
- ✅ Xem chi tiết từng hồ sơ
- ✅ Duyệt hoặc từ chối hồ sơ
- ✅ Xem biểu đồ tiến độ tuyển sinh

**Hành động:**
- Đăng nhập → Navbar hiển thị nút "Admin Panel"
- Nhấn "Admin Panel" → Chuyển đến trang `/admin/dashboard`
- Tại đây có:
  - **Stat Cards**: 3 thẻ hiển thị thống kê
  - **Charts**: Biểu đồ tiến độ tuyển sinh (Bar + Line chart)
  - **Applications Table**: Danh sách hồ sơ
  - **Sidebar**: Chi tiết hồ sơ + nút Duyệt/Từ chối

## 🔄 Luồng Nộp Hồ Sơ

### Cho Thí Sinh Chưa Đăng Nhập:
```
Trang chủ → Bấm "Nộp Hồ Sơ Online" 
  → Modal "Đăng Nhập / Đăng Kí" 
  → Chọn "Đăng Kí" hoặc "Đăng Nhập"
  → Hoàn thành auth
  → Chuyển đến /apply (Form nộp hồ sơ)
```

### Cho Thí Sinh Đã Đăng Nhập:
```
Trang chủ → Bấm "Nộp Hồ Sơ Online" 
  → Chuyển đến /candidate/portal
  → Click tab "Nộp Hồ Sơ"
  → Hoặc trực tiếp vào /apply
```

### Form Nộp Hồ Sơ (3 Bước):
1. **Thông Tin Cơ Bản**
   - Chọn chương trình (có hiển thị chỉ tiêu)
   - Nhập trường cấp 3
   - Nhập số điện thoại
   - Nhập địa chỉ (tùy chọn)

2. **Tải Lên Tài Liệu**
   - Upload file PDF
   - Tối đa 10MB
   - Bao gồm: hóa đơn, chứng chỉ, thành tích

3. **Xác Nhận**
   - Hiển thị tóm tắt thông tin
   - Nút "Nộp Hồ Sơ" (màu xanh)
   - Sau khi nộp → Redirect về Cổng Thí Sinh

## 🔐 Bảo Vệ Routes

### Protected Routes (yêu cầu đăng nhập):
- `/candidate/portal` - Chỉ thí sinh
- `/admin/dashboard` - Chỉ admin
- `/apply` - Chỉ thí sinh

### ProtectedRoute Component:
- Kiểm tra nếu user chưa đăng nhập → Redirect `/login`
- Kiểm tra role → Nếu sai redirect `/unauthorized`

## 📊 Dữ Liệu API Integration

### Login/Register
```
POST /api/users/login
POST /api/users/register
GET /api/users/me
```

### Admission Methods (Admission Routes)
```
GET /api/admissionMethods - Lấy danh sách phương thức
GET /api/admissionMethods/:id - Chi tiết phương thức
GET /api/admissionMethods/stats - Thống kê (Admin only)
GET /api/admissionMethods/applications - Danh sách hồ sơ (Admin only)
POST /api/admissionMethods/apply - Nộp hồ sơ (Candidate)
PATCH /api/admissionMethods/:id/approve - Duyệt (Admin only)
PATCH /api/admissionMethods/:id/reject - Từ chối (Admin only)
```

## 🎨 Giao Diện Chính

### 1. Navbar
- Logo PTIT
- Menu navigation
- Người chưa đăng nhập: "Đăng Nhập / Đăng Kí" + "Nộp Hồ Sơ Online"
- Người đã đăng nhập: 
  - Nếu candidate: "Nộp Hồ Sơ Online" + "Đăng Xuất"
  - Nếu admin: "Admin Panel" + "Đăng Xuất"

### 2. Trang Chủ
- Hero section với thông tin tuyển sinh 2025
- Quick links (3 buttons)
- Admission Targets (tabs: Hà Nội / TPHCM)
- Footer

### 3. Candidate Portal (/candidate/portal)
- Header với tên user
- Stat cards: Hồ sơ đã nộp, Trúng tuyển, Đang duyệt
- 3 tabs: Thông tin cá nhân, Nộp hồ sơ, Trạng thái hồ sơ

### 4. Admin Dashboard (/admin/dashboard)
- Header với tên admin
- Stat cards: Tổng thí sinh, Hồ sơ mới, Tỷ lệ trúng tuyển
- 2 charts: Tiến độ tuyển sinh (Bar + Line)
- Danh sách hồ sơ + sidebar chi tiết
- Nút duyệt/từ chối hồ sơ

### 5. Apply Page (/apply)
- Form multi-step nộp hồ sơ
- Progress bar
- Steps sidebar
- Buttons điều hướng

## 💾 State Management

Sử dụng **Zustand** để quản lý auth state:
```javascript
useAuthStore() - Lấy user, login, logout, register
```

## 🔧 Environment Variables

Cần thêm vào `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

## ✅ Tính Năng Hoàn Chỉnh

- ✅ Đăng nhập / Đăng kí
- ✅ Phân quyền theo role
- ✅ Protected routes
- ✅ Form nộp hồ sơ multi-step
- ✅ Admin dashboard với thống kê
- ✅ Duyệt/từ chối hồ sơ
- ✅ Xem trạng thái hồ sơ
- ✅ Responsive design
- ✅ Toàn bộ tiếng Việt
- ✅ Integration sẵn sàng cho API Express.js
