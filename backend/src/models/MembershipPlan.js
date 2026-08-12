const mongoose = require('mongoose');

const membershipPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please specify plan name'],
      trim: true
    },
    durationMonths: {
      type: Number,
      required: [true, 'Please specify duration in months'],
      min: 1
    },
    price: {
      type: Number,
      required: [true, 'Please specify plan price'],
      min: 0
    },
    description: {
      type: String,
      default: ''
    },
    features: [
      {
        type: String,
        trim: true
      }
    ],
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('MembershipPlan', membershipPlanSchema);
