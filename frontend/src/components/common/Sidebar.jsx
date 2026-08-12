import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  CreditCard,
  CalendarCheck,
  Dumbbell,
  TrendingUp,
  Megaphone,
  Settings,
  LogOut,
  Layers,
  Award,
  User,
  ShieldAlert,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  const adminNav = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Members', path: '/admin/members', icon: Users },
    { name: 'Trainers', path: '/admin/trainers', icon: UserCheck },
    { name: 'Plans', path: '/admin/plans', icon: Layers },
    { name: 'Memberships', path: '/admin/memberships', icon: Award },
    { name: 'Payments', path: '/admin/payments', icon: CreditCard },
    { name: 'Attendance', path: '/admin/attendance', icon: CalendarCheck },
    { name: 'Workouts', path: '/admin/workouts', icon: Dumbbell },
    { name: 'Progress', path: '/admin/progress', icon: TrendingUp },
    { name: 'Announcements', path: '/admin/announcements', icon: Megaphone },
    { name: 'Settings', path: '/admin/settings', icon: Settings }
  ];

  const trainerNav = [
    { name: 'Dashboard', path: '/trainer/dashboard', icon: LayoutDashboard },
    { name: 'Assigned Members', path: '/trainer/members', icon: Users },
    { name: 'Workout Planner', path: '/trainer/workouts', icon: Dumbbell },
    { name: 'Mark Attendance', path: '/trainer/attendance', icon: CalendarCheck },
    { name: 'Member Progress', path: '/trainer/progress', icon: TrendingUp }
  ];

  const memberNav = [
    { name: 'Dashboard', path: '/member/dashboard', icon: LayoutDashboard },
    { name: 'My Membership', path: '/member/membership', icon: Award },
    { name: 'My Workout', path: '/member/workout', icon: Dumbbell },
    { name: 'My Attendance', path: '/member/attendance', icon: CalendarCheck },
    { name: 'Body Progress', path: '/member/progress', icon: TrendingUp },
    { name: 'Payment History', path: '/member/payments', icon: CreditCard },
    { name: 'My Profile', path: '/member/profile', icon: User }
  ];

  let navItems = memberNav;
  if (user.role === 'admin') navItems = adminNav;
  if (user.role === 'trainer') navItems = trainerNav;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-300 w-64">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <Dumbbell className="w-6 h-6 transform -rotate-12" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-wider">FIT<span className="text-amber-400">FORGE</span></h1>
            <p className="text-[10px] uppercase font-bold text-amber-500 tracking-widest">{user.role} console</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white p-1">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* User Info Capsule */}
      <div className="px-4 py-4 mx-3 my-3 rounded-xl bg-slate-850 border border-slate-800/80 flex items-center space-x-3">
        <img
          src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover border-2 border-amber-500/40"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-100 truncate">{user.name}</p>
          <p className="text-xs text-slate-400 truncate">{user.email}</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">{item.name}</span>
          </NavLink>
        ))}
      </div>

      {/* Footer Logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-sm font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-slate-950/80 backdrop-blur-sm" onClick={onClose}>
          <div className="fixed inset-y-0 left-0 z-50 w-64" onClick={(e) => e.stopPropagation()}>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
