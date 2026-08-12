import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import TrainerLayout from './layouts/TrainerLayout';
import MemberLayout from './layouts/MemberLayout';

// Guard components
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleRoute from './components/common/RoleRoute';

// Public pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import MemberManagement from './pages/admin/MemberManagement';
import MemberDetail from './pages/admin/MemberDetail';
import TrainerManagement from './pages/admin/TrainerManagement';
import PlanManagement from './pages/admin/PlanManagement';
import MembershipManagement from './pages/admin/MembershipManagement';
import PaymentManagement from './pages/admin/PaymentManagement';
import AttendanceManagement from './pages/admin/AttendanceManagement';
import WorkoutManagement from './pages/admin/WorkoutManagement';
import ProgressManagement from './pages/admin/ProgressManagement';
import AnnouncementManagement from './pages/admin/AnnouncementManagement';
import AdminSettings from './pages/admin/AdminSettings';

// Trainer pages
import TrainerDashboard from './pages/trainer/TrainerDashboard';
import TrainerMembers from './pages/trainer/TrainerMembers';
import TrainerWorkouts from './pages/trainer/TrainerWorkouts';
import TrainerAttendance from './pages/trainer/TrainerAttendance';
import TrainerProgress from './pages/trainer/TrainerProgress';

// Member pages
import MemberDashboard from './pages/member/MemberDashboard';
import MemberMembership from './pages/member/MemberMembership';
import MemberWorkout from './pages/member/MemberWorkout';
import MemberAttendance from './pages/member/MemberAttendance';
import MemberProgress from './pages/member/MemberProgress';
import MemberPayments from './pages/member/MemberPayments';
import MemberProfile from './pages/member/MemberProfile';

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Admin Console Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['admin']}>
              <AdminLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="members" element={<MemberManagement />} />
        <Route path="members/:id" element={<MemberDetail />} />
        <Route path="trainers" element={<TrainerManagement />} />
        <Route path="plans" element={<PlanManagement />} />
        <Route path="memberships" element={<MembershipManagement />} />
        <Route path="payments" element={<PaymentManagement />} />
        <Route path="attendance" element={<AttendanceManagement />} />
        <Route path="workouts" element={<WorkoutManagement />} />
        <Route path="progress" element={<ProgressManagement />} />
        <Route path="announcements" element={<AnnouncementManagement />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Trainer Console Routes */}
      <Route
        path="/trainer"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['trainer']}>
              <TrainerLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/trainer/dashboard" replace />} />
        <Route path="dashboard" element={<TrainerDashboard />} />
        <Route path="members" element={<TrainerMembers />} />
        <Route path="workouts" element={<TrainerWorkouts />} />
        <Route path="attendance" element={<TrainerAttendance />} />
        <Route path="progress" element={<TrainerProgress />} />
      </Route>

      {/* Member Portal Routes */}
      <Route
        path="/member"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['member']}>
              <MemberLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/member/dashboard" replace />} />
        <Route path="dashboard" element={<MemberDashboard />} />
        <Route path="membership" element={<MemberMembership />} />
        <Route path="workout" element={<MemberWorkout />} />
        <Route path="attendance" element={<MemberAttendance />} />
        <Route path="progress" element={<MemberProgress />} />
        <Route path="payments" element={<MemberPayments />} />
        <Route path="profile" element={<MemberProfile />} />
      </Route>

      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
