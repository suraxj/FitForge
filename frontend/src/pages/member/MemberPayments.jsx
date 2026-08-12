import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/paymentService';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import StatCard from '../../components/common/StatCard';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  DollarSign,
  Receipt
} from 'lucide-react';

const MemberPayments = () => {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const res = await paymentService.getMyPayments();
        if (res.success) {
          setPayments(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        console.error('Error fetching member payments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return <Loader message="Loading payment history..." />;
  }

  const safePayments = Array.isArray(payments) ? payments : [];

  // Calculate totals
  const totalPaid = safePayments
    .filter((p) => p && p.status === 'paid')
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  const pendingPayments = safePayments.filter((p) => p && p.status === 'pending');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white">Payment & Invoice History</h1>
        <p className="text-xs text-slate-400 mt-1">
          View billing records, transaction receipts, and payment method details.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Total Paid"
          value={`$${totalPaid.toLocaleString()}`}
          icon={DollarSign}
          subtext="Lifetime billing contributions"
          color="emerald"
        />

        <StatCard
          title="Total Transactions"
          value={`${payments.length} Invoices`}
          icon={CreditCard}
          subtext="Issued receipts"
          color="amber"
        />

        <StatCard
          title="Pending Payments"
          value={`${pendingPayments.length}`}
          icon={Clock}
          subtext={pendingPayments.length > 0 ? 'Action required' : 'All clear'}
          color={pendingPayments.length > 0 ? 'rose' : 'cyan'}
        />
      </div>

      {/* Payment Records Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
              <Receipt className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white">Billing History</h2>
          </div>
        </div>

        {safePayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-850 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Invoice ID</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Plan / Description</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Payment Method</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-r-xl text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {safePayments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-amber-400 text-[11px]">
                      #{p._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-4 py-3.5 text-slate-300 font-medium">
                      {new Date(p.createdAt || p.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-white">
                      {p.membership?.plan?.name || p.description || 'Gym Membership Fee'}
                    </td>
                    <td className="px-4 py-3.5 font-extrabold text-white">
                      ${p.amount}
                    </td>
                    <td className="px-4 py-3.5 text-slate-400 capitalize">
                      {p.paymentMethod || 'Credit Card'}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        p.status === 'paid'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : p.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedInvoice(p)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="View Invoice"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 rounded-xl bg-slate-850 border border-slate-800/60 border-dashed">
            <CreditCard className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-300 font-bold text-sm">No Payment Transactions Found</p>
            <p className="text-xs text-slate-500 mt-1">
              Your billing invoices and receipts will be listed here after membership payments.
            </p>
          </div>
        )}
      </div>

      {/* Invoice Receipt Modal */}
      {selectedInvoice && (
        <Modal title="Payment Invoice Receipt" onClose={() => setSelectedInvoice(null)}>
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <span className="text-xs text-slate-400 font-semibold">Invoice No.</span>
                <span className="font-mono text-xs text-amber-400 font-bold">#{selectedInvoice._id.toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Transaction Date:</span>
                <span className="text-white font-medium">{new Date(selectedInvoice.createdAt || selectedInvoice.date).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Payment Method:</span>
                <span className="text-white font-medium capitalize">{selectedInvoice.paymentMethod || 'Credit Card'}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold uppercase text-emerald-400">{selectedInvoice.status}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-white">{selectedInvoice.membership?.plan?.name || 'FitForge Membership'}</p>
                <p className="text-[10px] text-slate-400">Subscription & Gym Access Fee</p>
              </div>
              <span className="text-xl font-black text-amber-400">${selectedInvoice.amount}</span>
            </div>

            <div className="pt-4 border-t border-slate-800 text-right">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MemberPayments;
