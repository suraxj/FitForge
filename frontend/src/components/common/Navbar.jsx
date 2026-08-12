import React from 'react';
import { Menu, Dumbbell, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onOpenSidebar, title = 'Dashboard' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 text-slate-100">
      {/* Left side title & mobile menu toggle */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onOpenSidebar}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{title}</h2>
          <p className="text-xs text-slate-400 hidden sm:block">Welcome back to FitForge Management Suite</p>
        </div>
      </div>

      {/* Right side profile & quick actions */}
      <div className="flex items-center space-x-3 sm:space-x-5">
        {/* Quick notification bell indicator */}
        <div className="relative p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800/80 cursor-pointer transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400"></span>
        </div>

        {/* User Card Badge */}
        {user && (
          <div
            onClick={() => {
              if (user.role === 'member') navigate('/member/profile');
              else if (user.role === 'admin') navigate('/admin/settings');
            }}
            className="flex items-center space-x-3 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 cursor-pointer hover:border-slate-600 transition-all"
          >
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border border-amber-500/40"
            />
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-100 leading-tight">{user.name}</p>
              <p className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">{user.role}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
