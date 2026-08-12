import React, { useState } from 'react';
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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-[#190a38] p-8 sm:p-10 rounded-3xl border border-purple-900/60 shadow-2xl relative">
        {/* Brand logo header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6d28d9] to-[#00d2c4] flex items-center justify-center text-white font-black shadow-lg shadow-purple-900/50 mx-auto">
            <Dumbbell className="w-7 h-7 transform -rotate-12" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase">Sign In to FitForge</h2>
          <p className="text-xs text-purple-300">Access your role-based fitness management suite</p>
        </div>

        {/* 1-Click Demo Login Quick Buttons */}
        <div className="space-y-2 pt-2">
          <p className="text-[11px] font-black uppercase tracking-wider text-[#00d2c4] text-center">⚡ 1-Click Demo Accounts</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => quickFill('admin@gym.com', 'Admin@123')}
              className="px-2 py-2 rounded-xl text-xs font-bold bg-[#261159] hover:bg-purple-900/60 text-[#00d2c4] border border-purple-700/40 flex items-center justify-center space-x-1 transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
            <button
              type="button"
              onClick={() => quickFill('trainer@gym.com', 'Trainer@123')}
              className="px-2 py-2 rounded-xl text-xs font-bold bg-[#261159] hover:bg-purple-900/60 text-[#00d2c4] border border-purple-700/40 flex items-center justify-center space-x-1 transition-all"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Trainer</span>
            </button>
            <button
              type="button"
              onClick={() => quickFill('member@gym.com', 'Member@123')}
              className="px-2 py-2 rounded-xl text-xs font-bold bg-[#261159] hover:bg-purple-900/60 text-[#00d2c4] border border-purple-700/40 flex items-center justify-center space-x-1 transition-all"
            >
              <User className="w-3.5 h-3.5" />
              <span>Member</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-3 text-purple-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#0d0620] border border-purple-900/80 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00d2c4] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-3 text-purple-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0d0620] border border-purple-900/80 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00d2c4] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full font-black text-xs uppercase tracking-wider bg-[#6d28d9] hover:bg-[#5b21b6] text-white shadow-lg shadow-purple-950 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
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
        <div className="text-center text-xs text-slate-400 pt-2 border-t border-purple-900/60">
          Don't have a gym membership account yet?{' '}
          <NavLink to="/register" className="text-[#00d2c4] font-bold hover:underline">
            Register as Member
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
