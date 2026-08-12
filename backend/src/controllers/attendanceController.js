const Attendance = require('../models/Attendance');
const Member = require('../models/Member');

// @desc    Mark attendance (Single or Bulk)
// @route   POST /api/attendance
// @access  Private (Admin, Trainer)
const markAttendance = async (req, res) => {
  try {
    const { memberId, date, status, notes, bulk } = req.body;

    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    // Bulk attendance update: array of { memberId, status }
    if (bulk && Array.isArray(bulk)) {
      const records = await Promise.all(
        bulk.map(async (item) => {
          return await Attendance.findOneAndUpdate(
            { member: item.memberId, date: targetDate },
            {
              member: item.memberId,
              date: targetDate,
              status: item.status || 'present',
              markedBy: req.user._id,
              notes: item.notes || ''
            },
            { upsert: true, new: true }
          );
        })
      );
      return res.status(200).json({ success: true, count: records.length, data: records });
    }

    // Single attendance update
    if (!memberId) {
      return res.status(400).json({ success: false, message: 'Member ID is required' });
    }

    const attendance = await Attendance.findOneAndUpdate(
      { member: memberId, date: targetDate },
      {
        member: memberId,
        date: targetDate,
        status: status || 'present',
        markedBy: req.user._id,
        notes: notes || ''
      },
      { upsert: true, new: true }
    ).populate({
      path: 'member',
      populate: { path: 'user', select: 'name email' }
    });

    return res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get attendance records with filter by date & status
// @route   GET /api/attendance
// @access  Private (Admin, Trainer)
const getAttendance = async (req, res) => {
  try {
    const { date, status, memberId } = req.query;

    let query = {};
    if (date) {
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);
      query.date = { $gte: targetDate, $lt: nextDay };
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (memberId) {
      query.member = memberId;
    }

    const records = await Attendance.find(query)
      .populate({
        path: 'member',
        populate: { path: 'user', select: 'name email phone avatar' }
      })
      .sort({ date: -1 });

    return res.json({ success: true, data: records });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get attendance statistics for logged in member
// @route   GET /api/attendance/my
// @access  Private (Member)
const getMyAttendance = async (req, res) => {
  try {
    const member = await Member.findOne({ user: req.user._id });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member profile not found' });
    }

    const records = await Attendance.find({ member: member._id }).sort({ date: -1 });

    return res.json({
      success: true,
      data: records
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  markAttendance,
  getAttendance,
  getMyAttendance
};
