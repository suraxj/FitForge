import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/paymentService';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import StatCard from '../../components/common/StatCard';
import ReceiptModal from '../../components/modals/ReceiptModal';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  DollarSign,
  Receipt,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const MemberPayments = () => {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [selectedReceiptPayment, setSelectedReceiptPayment] = useState(null);
  const [payModalPayment, setPayModalPayment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

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

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    if (!payModalPayment) return;

    setProcessing(true);
    try {
      const res = await paymentService.updateStatus(payModalPayment._id, 'paid', paymentMethod);
      if (res.success) {
        toast.success(`Payment of $${payModalPayment.amount} successful via ${paymentMethod}!`);
        setPayModalPayment(null);
        fetchPayments();
      }
    } catch (err) {
      toast.error('Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

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
          View billing records, transaction receipts, and settle pending invoices online.
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
          value={`${safePayments.length} Invoices`}
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
                  <th className="px-4 py-3 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {safePayments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-amber-400 text-[11px]">
                      #{p._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-4 py-3.5 text-slate-300 font-medium">
                      {new Date(p.paymentDate || p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-white">
                      {p.membership?.plan?.name || p.notes || 'Gym Membership Fee'}
                    </td>
                    <td className="px-4 py-3.5 font-extrabold text-white">
                      ${p.amount?.toFixed(2)}
                    </td>
                    <td className="px-4 py-3.5 text-slate-400 capitalize">
                      {p.paymentMethod || 'Cash'}
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
                    <td className="px-4 py-3.5 text-right space-x-2">
                      {p.status === 'pending' ? (
                        <button
                          onClick={() => setPayModalPayment(p)}
                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] uppercase transition-all shadow-md"
                        >
                          Pay Now
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedReceiptPayment(p)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs inline-flex items-center space-x-1.5 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </button>
                      )}
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

      {/* Online Payment Modal */}
      {payModalPayment && (
        <Modal title="Complete Payment Online" onClose={() => setPayModalPayment(null)} maxWidth="max-w-md">
          <form onSubmit={handleProcessPayment} className="space-y-5">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-amber-400">
              <div>
                <p className="text-xs font-bold text-white uppercase">{payModalPayment.membership?.plan?.name || 'Gym Plan Invoice'}</p>
                <p className="text-[10px] text-slate-400">Secure Instant Checkout</p>
              </div>
              <span className="text-2xl font-black">${payModalPayment.amount?.toFixed(2)}</span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-300">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {['UPI', 'Card', 'Online'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2.5 rounded-xl font-bold text-xs border transition-all ${
                      paymentMethod === method
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>256-Bit Encrypted Payment Simulation</span>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setPayModalPayment(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={processing}
                className="px-6 py-2.5 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg flex items-center space-x-2 transition-all disabled:opacity-50"
              >
                {processing ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>Confirm & Pay ${payModalPayment.amount}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Printable Receipt Modal */}
      <ReceiptModal
        isOpen={Boolean(selectedReceiptPayment)}
        onClose={() => setSelectedReceiptPayment(null)}
        payment={selectedReceiptPayment}
      />
    </div>
  );
};

export default MemberPayments;
