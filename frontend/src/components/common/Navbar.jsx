import React from 'react';
import { Menu, Dumbbell, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onOpenSidebar, title = 'Dashboard' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3.5 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 font-['Outfit',sans-serif]">
      {/* Left side title & mobile menu toggle */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onOpenSidebar}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">{title}</h2>
          <p className="text-xs text-slate-400 font-medium hidden sm:block">FitForge Premium SaaS Gym Platform</p>
        </div>
      </div>

      {/* Right side profile, notification bell & quick Logout button */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Quick notification bell indicator */}
        <div className="relative p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-slate-800/80 cursor-pointer transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400"></span>
        </div>

        {/* User Card Badge */}
        {user && (
          <div
            onClick={() => {
              if (user.role === 'member') navigate('/member/profile');
              else if (user.role === 'admin') navigate('/admin/settings');
            }}
            className="flex items-center space-x-3 px-3 py-1.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 cursor-pointer hover:border-emerald-500/50 transition-all"
          >
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border border-emerald-500/50"
            />
            <div className="hidden lg:block text-left">
              <p className="text-xs font-black text-slate-100 leading-tight">{user.name}</p>
              <p className="text-[10px] uppercase font-extrabold text-emerald-400 tracking-wider">{user.role}</p>
            </div>
          </div>
        )}

        {/* Prominent Header Logout Button */}
        <button
          onClick={handleLogout}
          className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 hover:text-rose-300 border border-rose-500/30 text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 transition-all"
          title="Log out of FitForge"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
