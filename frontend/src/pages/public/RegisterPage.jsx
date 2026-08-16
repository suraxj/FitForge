import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Dumbbell, User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, phone, password });
      navigate('/member/dashboard');
    } catch (err) {
      // Toast handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center px-4 py-8 font-['Outfit',sans-serif] bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="w-full max-w-md space-y-6 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl relative">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 mx-auto">
            <Dumbbell className="w-6 h-6 transform -rotate-12 text-slate-950" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Create Member Account</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Join FitForge to view workouts, membership, & track progress</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">Full Name</label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3.5 top-3 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-3 text-slate-400 dark:text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">Phone Number</label>
            <div className="relative">
              <Phone className="w-5 h-5 absolute left-3.5 top-3 text-slate-400 dark:text-slate-500" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
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
                placeholder="At least 6 characters"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full font-black text-xs uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Register & Enter Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
          Already have an account?{' '}
          <NavLink to="/login" className="text-emerald-600 dark:text-emerald-400 font-extrabold hover:underline">
            Sign In here
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
