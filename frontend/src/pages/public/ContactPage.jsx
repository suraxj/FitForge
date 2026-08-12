import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Thank you! Your message has been sent to FitForge Support.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">GET IN TOUCH</h1>
        <p className="text-slate-400 text-lg">Have questions about memberships or our SaaS gym platform? Contact us anytime.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card p-8 rounded-3xl space-y-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto"><MapPin className="w-6 h-6" /></div>
          <h3 className="text-lg font-bold text-white">Visit HQ</h3>
          <p className="text-xs text-slate-400">100 Fitness Boulevard, Suite 500<br />New York, NY 10001</p>
        </div>

        <div className="glass-card p-8 rounded-3xl space-y-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto"><Phone className="w-6 h-6" /></div>
          <h3 className="text-lg font-bold text-white">Phone</h3>
          <p className="text-xs text-slate-400">+1 (800) 555-FORGE<br />Mon-Sun: 6:00 AM - 11:00 PM</p>
        </div>

        <div className="glass-card p-8 rounded-3xl space-y-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto"><Mail className="w-6 h-6" /></div>
          <h3 className="text-lg font-bold text-white">Email</h3>
          <p className="text-xs text-slate-400">support@fitforge.com<br />memberships@fitforge.com</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-300">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-300">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-slate-300">Subject</label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-slate-300">Message</label>
            <textarea
              rows={4}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-extrabold text-sm bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center space-x-2"
          >
            <span>Send Message</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
