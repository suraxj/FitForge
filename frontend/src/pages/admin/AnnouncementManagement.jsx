import React, { useState, useEffect } from 'react';
import { announcementService } from '../../services/announcementService';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { Megaphone, Plus, Trash2, AlertTriangle, Bell, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const AnnouncementManagement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    priority: 'normal'
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await announcementService.getAnnouncements();
      if (res.success) setAnnouncements(res.data);
    } catch (err) {
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      const res = await announcementService.createAnnouncement(formData);
      if (res.success) {
        toast.success('Announcement broadcasted!');
        setIsModalOpen(false);
        setFormData({ title: '', message: '', priority: 'normal' });
        fetchAnnouncements();
      }
    } catch (err) {
      toast.error('Error posting announcement');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      const res = await announcementService.deleteAnnouncement(deleteId);
      if (res.success) {
        toast.success('Announcement deleted');
        fetchAnnouncements();
      }
    } catch (err) {
      toast.error('Error deleting announcement');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Gym Announcements</h1>
          <p className="text-xs text-slate-400">Broadcast important facility updates, holiday hours, and maintenance notices to members & trainers.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg flex items-center space-x-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Announcement</span>
        </button>
      </div>

      {loading ? (
        <Loader message="Loading announcement board..." />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {announcements.map((item) => (
            <div
              key={item._id}
              className={`glass-card p-6 rounded-3xl space-y-3 border relative transition-all ${
                item.priority === 'urgent'
                  ? 'border-rose-500/30 bg-rose-950/10'
                  : item.priority === 'important'
                  ? 'border-amber-500/30 bg-amber-950/10'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2.5 rounded-2xl ${
                      item.priority === 'urgent'
                        ? 'bg-rose-500/10 text-rose-400'
                        : item.priority === 'important'
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-blue-500/10 text-blue-400'
                    }`}
                  >
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{item.title}</h3>
                    <p className="text-[11px] text-slate-400">
                      Posted on {new Date(item.createdAt).toLocaleDateString()} by {item.author?.name || 'Admin'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                      item.priority === 'urgent'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : item.priority === 'important'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.priority}
                  </span>
                  <button
                    onClick={() => setDeleteId(item._id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pl-12">{item.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Broadcast Announcement">
        <form onSubmit={handleCreateAnnouncement} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-slate-300">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. 🏋️ New Equipment Arrival!"
              className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-300">Priority Tag</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="normal">Normal</option>
              <option value="important">Important</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-300">Message Body *</label>
            <textarea
              rows={4}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Detailed announcement content..."
              className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-xs bg-slate-800 text-slate-300">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-xl text-xs font-extrabold bg-amber-500 text-slate-950">Publish Notice</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Announcement"
        message="Are you sure you want to delete this announcement?"
      />
    </div>
  );
};

export default AnnouncementManagement;
