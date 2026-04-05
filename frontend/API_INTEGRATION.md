# API Integration Guide - PTIT Admission Portal

## Environment Setup

Create a `.env.local` file in your project root:

```
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

## API Endpoints Connected

### Authentication (authAPI)
- `POST /users/login` - User login
- `POST /users/register` - User registration (with idNumber field)
- `GET /users/me` - Get current user info

### Admission Methods (admissionAPI)
#### Public Endpoints
- `GET /admissionMethods` - Get all admission methods (programs)
- `GET /admissionMethods/:id` - Get specific method details

#### Admin Only (Protected)
- `POST /admissionMethods` - Create new admission method
- `PUT /admissionMethods/:id` - Update admission method
- `DELETE /admissionMethods/:id` - Delete admission method
- `PATCH /admissionMethods/:id/toggle` - Toggle method active status

#### Application Management
- `POST /admissionMethods/apply` - Submit application (FormData with file upload)
- `GET /admissionMethods/stats` - Get admin statistics
- `GET /admissionMethods/applications` - Get all applications (admin only)
- `PATCH /admissionMethods/:id/approve` - Approve application (admin only)
- `PATCH /admissionMethods/:id/reject` - Reject application (admin only)

## Frontend Data Flow

### 1. Registration Page (`/register`)
```
User fills form (username, email, fullName, phone, idNumber, password)
    ↓
RegisterForm calls authAPI.register()
    ↓
Server returns { user, token }
    ↓
useAuthStore.login() saves user + token to localStorage
    ↓
Redirect to /candidate/portal or /admin/dashboard
```

### 2. Login Page (`/login`)
```
User fills form (username, password)
    ↓
LoginForm calls authAPI.login()
    ↓
Server returns { user, token }
    ↓
useAuthStore.login() saves user + token to localStorage
    ↓
Redirect based on user.role (admin → /admin/dashboard, candidate → /candidate/portal)
```

### 3. Application Submission (`/apply`)
```
useEffect fetches admission methods via admissionAPI.getAllMethods()
    ↓
User fills multi-step form:
  - Step 1: Select method from dropdown, program name, high school, phone, address
  - Step 2: Upload PDF file
  - Step 3: Review and confirm
    ↓
On submit, create FormData with all fields + file
    ↓
admissionAPI.submitApplication(token, formData)
    ↓
Redirect to /candidate/portal
```

### 4. Admin Dashboard (`/admin/dashboard`)
```
useEffect fetches all applications via admissionAPI.getApplications(token)
    ↓
Admin clicks on application row to view details in sidebar
    ↓
Click "Duyệt" (Approve) → admissionAPI.approveApplication(token, appId)
    ↓
Click "Từ Chối" (Reject) → admissionAPI.rejectApplication(token, appId)
    ↓
Application status updates in table
```

## Authentication Storage

Token and user info are stored in localStorage with keys:
- `authToken` - JWT token for API requests
- `authUser` - User object (JSON stringified)

All API calls include: `Authorization: Bearer ${token}` header

## Files Modified

- `lib/api.ts` - All API endpoints configured
- `lib/auth-store.ts` - Zustand store with localStorage persistence
- `components/register-form.tsx` - Registration with CCCD field
- `components/login-form.tsx` - Login form
- `components/submit-application-form.tsx` - Application form with API integration
- `components/admin-dashboard.tsx` - Admin dashboard with applications list
- `components/navbar.tsx` - Navigation with auth-aware buttons

## Testing the Integration

1. Set `NEXT_PUBLIC_API_URL` in `.env.local`
2. Ensure Express backend is running on port 5001
3. Register a new candidate account
4. Navigate to "Nộp Hồ Sơ Online" to test application submission
5. Login as admin to see applications and approve/reject

All forms validate input and show error messages to users.
