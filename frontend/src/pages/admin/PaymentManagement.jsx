import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/paymentService';
import { memberService } from '../../services/memberService';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import ReceiptModal from '../../components/modals/ReceiptModal';
import { CreditCard, Search, Plus, Filter, FileText, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedReceiptPayment, setSelectedReceiptPayment] = useState(null);

  const [formData, setFormData] = useState({
    memberId: '',
    amount: 129,
    paymentMethod: 'UPI',
    status: 'paid',
    notes: 'Direct Gym Counter Settlement'
  });

  useEffect(() => {
    fetchPayments();
    fetchMembersDropdown();
  }, [page, statusFilter, methodFilter]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await paymentService.getPayments({
        page,
        limit: 10,
        search,
        status: statusFilter,
        method: methodFilter
      });
      if (res.success) {
        setPayments(res.data.payments);
        setTotalPages(res.data.pages || 1);
      }
    } catch (err) {
      toast.error('Failed to load payment transactions');
    } finally {
      setLoading(false);
    }
  };

  const fetchMembersDropdown = async () => {
    try {
      const res = await memberService.getMembers({ limit: 100 });
      if (res.success) setMembers(res.data.members);
    } catch (e) {
      // ignore
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPayments();
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!formData.memberId || !formData.amount) {
      toast.error('Please select member and enter valid amount');
      return;
    }

    try {
      const res = await paymentService.createPayment(formData);
      if (res.success) {
        toast.success('Payment logged successfully');
        setIsAddModalOpen(false);
        fetchPayments();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error recording payment');
    }
  };

  const handleMarkAsPaid = async (paymentId) => {
    try {
      const res = await paymentService.updateStatus(paymentId, 'paid');
      if (res.success) {
        toast.success('Payment marked as Paid!');
        fetchPayments();
      }
    } catch (err) {
      toast.error('Failed to update payment status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Payment Ledger</h1>
          <p className="text-xs text-slate-400">Track financial transactions, resolve pending invoices, and issue receipts.</p>
        </div>

        <button
          onClick={() => {
            if (members.length > 0) setFormData((prev) => ({ ...prev, memberId: members[0]._id }));
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg flex items-center space-x-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Payment</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-800">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search member..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2"
          >
            <option value="all">All Payment Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>

          <select
            value={methodFilter}
            onChange={(e) => {
              setMethodFilter(e.target.value);
              setPage(1);
            }}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2"
          >
            <option value="all">All Payment Methods</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
            <option value="Online">Online</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      {loading ? (
        <Loader message="Fetching transaction logs..." />
      ) : (
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 uppercase text-[10px] font-bold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4">Member Name</th>
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {payments.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-8 text-slate-500">No payment logs found.</td></tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-800/40">
                      <td className="p-4 font-bold text-white">{p.member?.user?.name || 'N/A'}</td>
                      <td className="p-4 font-mono text-amber-400">{p.transactionId}</td>
                      <td className="p-4">{new Date(p.paymentDate).toLocaleDateString()}</td>
                      <td className="p-4 font-semibold">{p.paymentMethod}</td>
                      <td className="p-4 font-extrabold text-white">${p.amount?.toFixed(2)}</td>
                      <td className="p-4">
                        {p.status === 'paid' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Paid
                          </span>
                        ) : (
                          <button
                            onClick={() => handleMarkAsPaid(p._id)}
                            className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20"
                          >
                            Mark Paid
                          </button>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedReceiptPayment(p)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold flex items-center space-x-1.5 ml-auto"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Page {page} of {totalPages}</span>
            <div className="flex items-center space-x-2">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="p-1.5 rounded-lg bg-slate-800 disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
              <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="p-1.5 rounded-lg bg-slate-800 disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Record Manual Payment Entry">
        <form onSubmit={handleRecordPayment} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-slate-300">Member *</label>
            <select
              required
              value={formData.memberId}
              onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
              className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="">-- Select Member --</option>
              {members.map((m) => (
                <option key={m._id} value={m._id}>{m.user?.name} ({m.user?.email})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-300">Amount ($) *</label>
              <input
                type="number"
                required
                min={1}
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-300">Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="Online">Online</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-300">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="paid">Paid</option>
              <option value="pending">Pending Settlement</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-300">Notes</label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 rounded-xl text-xs bg-slate-800 text-slate-300">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-xl text-xs font-extrabold bg-amber-500 text-slate-950">Record Entry</button>
          </div>
        </form>
      </Modal>

      {/* Printable Receipt Modal */}
      <ReceiptModal
        isOpen={Boolean(selectedReceiptPayment)}
        onClose={() => setSelectedReceiptPayment(null)}
        payment={selectedReceiptPayment}
      />
    </div>
  );
};

export default PaymentManagement;
