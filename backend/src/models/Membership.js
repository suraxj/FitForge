const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MembershipPlan',
      required: true
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    expiryDate: {
      type: Date,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'pending', 'failed'],
      default: 'pending'
    },
    status: {
      type: String,
      enum: ['active', 'expiring_soon', 'expired'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

// Pre-save or virtual helper to update status based on date
membershipSchema.pre('save', function (next) {
  const now = new Date();
  const warningWindow = new Date();
  warningWindow.setDate(warningWindow.getDate() + 7);

  if (this.expiryDate < now) {
    this.status = 'expired';
  } else if (this.expiryDate <= warningWindow) {
    this.status = 'expiring_soon';
  } else {
    this.status = 'active';
  }
  next();
});

module.exports = mongoose.model('Membership', membershipSchema);
