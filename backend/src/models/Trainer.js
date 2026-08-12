const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    specializations: [
      {
        type: String,
        trim: true
      }
    ],
    experience: {
      type: Number,
      default: 0
    },
    bio: {
      type: String,
      default: ''
    },
    salary: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    assignedMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Trainer', trainerSchema);
