# AFTRAS Dashboard Redirection Fix

## Current Progress
✅ **Plan approved by user**

## TODO Steps
- [x] **1. Create this TODO.md file**
- [x] **2. Fix src/pages/Login.tsx** ✅
  - Add `useAuth()` hook 
  - Remove unreliable manual profile fetch
  - Add `useEffect` to navigate after `profile` loads from AuthContext
  - Add `console.log('Login redirect:', profile?.role)` for debugging
  - Add error handling for failed auth/profile
- [ ] **3. Test redirects**
  - Admin user → `/admin`
  - Company user → `/dashboard`
  - Check browser console logs
- [ ] **4. Verify Navbar/ProtectedRoute behavior** 
- [ ] **5. Clean up console.logs**
- [ ] **6. Mark complete ✓**

## Expected Result
Admin users redirect to `/admin` dashboard after login
Company users redirect to `/dashboard`

