const Progress = require('../models/Progress');
const Member = require('../models/Member');

// @desc    Get progress logs for a specific member
// @route   GET /api/progress/member/:memberId
// @access  Private
const getProgressByMember = async (req, res) => {
  try {
    const history = await Progress.find({ member: req.params.memberId }).sort({ date: 1 });
    return res.json({ success: true, data: history });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add member body progress measurement
// @route   POST /api/progress
// @access  Private (Admin, Trainer)
const addProgress = async (req, res) => {
  try {
    let { memberId, weight, height, bodyFatPercentage, chest, waist, arms, date } = req.body;

    if (req.user.role === 'member') {
      const memberDoc = await Member.findOne({ user: req.user._id });
      if (!memberDoc) {
        return res.status(404).json({ success: false, message: 'Member profile not found' });
      }
      memberId = memberDoc._id;
    }

    if (!memberId || weight === undefined || height === undefined) {
      return res.status(400).json({ success: false, message: 'Member ID, weight, and height are required' });
    }

    const progress = await Progress.create({
      member: memberId,
      weight: Number(weight),
      height: Number(height),
      bodyFatPercentage: Number(bodyFatPercentage || 0),
      chest: Number(chest || 0),
      waist: Number(waist || 0),
      arms: Number(arms || 0),
      date: date ? new Date(date) : new Date(),
      recordedBy: req.user._id
    });

    return res.status(201).json({ success: true, data: progress });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete progress log
// @route   DELETE /api/progress/:id
// @access  Private (Admin, Trainer)
const deleteProgress = async (req, res) => {
  try {
    const progress = await Progress.findByIdAndDelete(req.params.id);
    if (!progress) {
      return res.status(404).json({ success: false, message: 'Progress record not found' });
    }
    return res.json({ success: true, message: 'Progress entry deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in member's progress history
// @route   GET /api/progress/my
// @access  Private (Member)
const getMyProgress = async (req, res) => {
  try {
    const member = await Member.findOne({ user: req.user._id });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member profile not found' });
    }

    const history = await Progress.find({ member: member._id }).sort({ date: 1 });
    return res.json({ success: true, data: history });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProgressByMember,
  addProgress,
  deleteProgress,
  getMyProgress
};
