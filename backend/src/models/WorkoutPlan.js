const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: Number, required: true, default: 3 },
  reps: { type: String, required: true, default: '10-12' },
  restTime: { type: String, default: '60s' },
  notes: { type: String, default: '' }
});

const workoutPlanSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true
    },
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trainer'
    },
    planName: {
      type: String,
      required: [true, 'Please specify plan name'],
      default: 'General Fitness Routine'
    },
    goal: {
      type: String,
      default: 'Muscle Building & Conditioning'
    },
    durationWeeks: {
      type: Number,
      default: 4
    },
    exercises: [exerciseSchema],
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
