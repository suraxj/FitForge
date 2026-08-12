const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true
    },
    weight: {
      type: Number,
      required: [true, 'Weight in kg is required']
    },
    height: {
      type: Number,
      required: [true, 'Height in cm is required']
    },
    bmi: {
      type: Number
    },
    bodyFatPercentage: {
      type: Number,
      default: 0
    },
    chest: {
      type: Number,
      default: 0
    },
    waist: {
      type: Number,
      default: 0
    },
    arms: {
      type: Number,
      default: 0
    },
    date: {
      type: Date,
      default: Date.now
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// Calculate BMI automatically before saving if height and weight present
progressSchema.pre('save', function (next) {
  if (this.weight && this.height) {
    const heightInMeters = this.height / 100;
    this.bmi = parseFloat((this.weight / (heightInMeters * heightInMeters)).toFixed(1));
  }
  next();
});

module.exports = mongoose.model('Progress', progressSchema);
