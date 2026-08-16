import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Dumbbell, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, User } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const userData = await login({ email, password });
      if (userData.role === 'admin') navigate('/admin/dashboard');
      else if (userData.role === 'trainer') navigate('/trainer/dashboard');
      else navigate('/member/dashboard');
    } catch (err) {
      // Error handled inside AuthContext toast
    } finally {
      setLoading(false);
    }
  };

  const quickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    toast.success(`Demo credentials set for ${demoEmail}`);
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center px-4 py-8 font-['Outfit',sans-serif] bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="w-full max-w-md space-y-6 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl relative">
        {/* Brand logo header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 mx-auto">
            <Dumbbell className="w-6 h-6 transform -rotate-12 text-slate-950" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Sign In to FitForge</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Access your role-based fitness management console</p>
        </div>

        {/* 1-Click Demo Login Quick Buttons */}
        <div className="space-y-2 pt-1">
          <p className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 text-center">⚡ 1-Click Demo Accounts</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => quickFill('admin@gym.com', 'Admin@123')}
              className="px-2 py-2 rounded-xl text-xs font-extrabold bg-emerald-50 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-slate-700 flex items-center justify-center space-x-1 transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
            <button
              type="button"
              onClick={() => quickFill('trainer@gym.com', 'Trainer@123')}
              className="px-2 py-2 rounded-xl text-xs font-extrabold bg-emerald-50 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-slate-700 flex items-center justify-center space-x-1 transition-all"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Trainer</span>
            </button>
            <button
              type="button"
              onClick={() => quickFill('member@gym.com', 'Member@123')}
              className="px-2 py-2 rounded-xl text-xs font-extrabold bg-emerald-50 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-slate-700 flex items-center justify-center space-x-1 transition-all"
            >
              <User className="w-3.5 h-3.5" />
              <span>Member</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-3 text-slate-400 dark:text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-3 text-slate-400 dark:text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full font-black text-xs uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
          Don't have a gym membership account yet?{' '}
          <NavLink to="/register" className="text-emerald-600 dark:text-emerald-400 font-extrabold hover:underline">
            Register as Member
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
