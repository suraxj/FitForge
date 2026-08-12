import React from 'react';
import Modal from '../common/Modal';
import { Dumbbell, Printer, CheckCircle2 } from 'lucide-react';

const ReceiptModal = ({ isOpen, onClose, payment }) => {
  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  const memberName = payment.member?.user?.name || 'N/A';
  const memberEmail = payment.member?.user?.email || 'N/A';
  const planName = payment.membership?.plan?.name || 'Gym Membership';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Official Payment Receipt" maxWidth="max-w-xl">
      <div className="space-y-6 text-slate-100 p-2 print:p-0 print:text-black">
        {/* Receipt Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black">
              <Dumbbell className="w-6 h-6 transform -rotate-12" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white">FITFORGE GYM</h3>
              <p className="text-xs text-slate-400">Official Tax Receipt</p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{payment.status}</span>
            </span>
            <p className="text-xs text-slate-400 mt-1">Receipt #: <span className="font-mono text-white">{payment.receiptNumber || 'REC-1001'}</span></p>
          </div>
        </div>

        {/* Receipt Metadata Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div>
            <p className="text-slate-400 uppercase font-bold text-[10px]">Member Details</p>
            <p className="font-bold text-sm text-white mt-0.5">{memberName}</p>
            <p className="text-slate-400">{memberEmail}</p>
          </div>
          <div>
            <p className="text-slate-400 uppercase font-bold text-[10px]">Transaction Info</p>
            <p className="font-mono text-xs text-amber-400 mt-0.5">{payment.transactionId}</p>
            <p className="text-slate-400">{new Date(payment.paymentDate).toLocaleDateString()} ({payment.paymentMethod})</p>
          </div>
        </div>

        {/* Line Item */}
        <div className="border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-900 text-slate-400 uppercase font-bold">
              <tr>
                <th className="p-3">Description</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr>
                <td className="p-3 font-semibold text-slate-200">{planName} Subscription</td>
                <td className="p-3 text-right font-extrabold text-white">${payment.amount?.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total Summary */}
        <div className="flex justify-between items-center bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl text-amber-400">
          <span className="font-bold text-sm uppercase">Total Amount Paid</span>
          <span className="text-2xl font-black">${payment.amount?.toFixed(2)}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-2 print:hidden">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-slate-800 hover:bg-slate-700 text-white flex items-center space-x-2 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ReceiptModal;
