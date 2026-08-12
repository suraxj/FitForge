const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true
    },
    membership: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Membership'
    },
    amount: {
      type: Number,
      required: true
    },
    paymentDate: {
      type: Date,
      default: Date.now
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'UPI', 'Card', 'Online'],
      default: 'Cash'
    },
    transactionId: {
      type: String,
      default: function () {
        return 'TXN-' + Math.floor(10000000 + Math.random() * 90000000);
      }
    },
    receiptNumber: {
      type: String,
      default: function () {
        return 'REC-' + Math.floor(100000 + Math.random() * 900000);
      }
    },
    status: {
      type: String,
      enum: ['paid', 'pending', 'failed'],
      default: 'paid'
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Payment', paymentSchema);
