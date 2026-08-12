const Member = require('../models/Member');
const User = require('../models/User');
const Membership = require('../models/Membership');
const Payment = require('../models/Payment');
const Attendance = require('../models/Attendance');
const WorkoutPlan = require('../models/WorkoutPlan');
const Progress = require('../models/Progress');
const Trainer = require('../models/Trainer');

// @desc    Get all members with pagination, search & status filter
// @route   GET /api/members
// @access  Private (Admin, Trainer)
const getMembers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search, status, trainer } = req.query;

    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (trainer) {
      query.assignedTrainer = trainer;
    }

    // Build aggregate or user lookup search query
    let userQuery = {};
    if (search) {
      userQuery = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ]
      };
      const matchingUsers = await User.find(userQuery).select('_id');
      const userIds = matchingUsers.map((u) => u._id);
      query.user = { $in: userIds };
    }

    const total = await Member.countDocuments(query);
    const members = await Member.find(query)
      .populate('user', 'name email phone avatar createdAt')
      .populate({
        path: 'membership',
        populate: { path: 'plan', select: 'name price durationMonths' }
      })
      .populate({
        path: 'assignedTrainer',
        populate: { path: 'user', select: 'name email phone' }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.json({
      success: true,
      data: {
        members,
        page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get member details by ID
// @route   GET /api/members/:id
// @access  Private
const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id)
      .populate('user', 'name email phone avatar createdAt')
      .populate({
        path: 'membership',
        populate: { path: 'plan' }
      })
      .populate({
        path: 'assignedTrainer',
        populate: { path: 'user', select: 'name email phone avatar specializations' }
      });

    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    // Fetch related logs
    const payments = await Payment.find({ member: member._id }).sort({ paymentDate: -1 });
    const attendanceLogs = await Attendance.find({ member: member._id }).sort({ date: -1 }).limit(30);
    const workoutPlan = await WorkoutPlan.findOne({ member: member._id }).sort({ createdAt: -1 });
    const progressHistory = await Progress.find({ member: member._id }).sort({ date: 1 });

    return res.json({
      success: true,
      data: {
        member,
        payments,
        attendanceLogs,
        workoutPlan,
        progressHistory
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create member (Admin)
// @route   POST /api/members
// @access  Private (Admin)
const createMember = async (req, res) => {
  try {
    const { name, email, phone, password, gender, dateOfBirth, address, emergencyContact, assignedTrainer, status } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, phone and password are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role: 'member'
    });

    const member = await Member.create({
      user: user._id,
      gender: gender || 'Unspecified',
      dateOfBirth: dateOfBirth || null,
      address: address || '',
      emergencyContact: emergencyContact || { name: '', phone: '', relation: '' },
      assignedTrainer: assignedTrainer || null,
      status: status || 'active'
    });

    // If trainer assigned, update trainer assignedMembers
    if (assignedTrainer) {
      await Trainer.findByIdAndUpdate(assignedTrainer, {
        $addToSet: { assignedMembers: member._id }
      });
    }

    const populatedMember = await Member.findById(member._id)
      .populate('user', 'name email phone avatar')
      .populate({
        path: 'assignedTrainer',
        populate: { path: 'user', select: 'name' }
      });

    return res.status(201).json({
      success: true,
      data: populatedMember
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update member
// @route   PUT /api/members/:id
// @access  Private (Admin, Trainer)
const updateMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    const { name, phone, gender, dateOfBirth, address, emergencyContact, assignedTrainer, status } = req.body;

    // Update User
    const user = await User.findById(member.user);
    if (user) {
      if (name) user.name = name;
      if (phone) user.phone = phone;
      await user.save();
    }

    // Handle assigned trainer change
    if (assignedTrainer !== undefined && String(assignedTrainer) !== String(member.assignedTrainer)) {
      if (member.assignedTrainer) {
        await Trainer.findByIdAndUpdate(member.assignedTrainer, {
          $pull: { assignedMembers: member._id }
        });
      }
      if (assignedTrainer) {
        await Trainer.findByIdAndUpdate(assignedTrainer, {
          $addToSet: { assignedMembers: member._id }
        });
      }
      member.assignedTrainer = assignedTrainer || null;
    }

    if (gender) member.gender = gender;
    if (dateOfBirth !== undefined) member.dateOfBirth = dateOfBirth;
    if (address !== undefined) member.address = address;
    if (emergencyContact) member.emergencyContact = { ...member.emergencyContact, ...emergencyContact };
    if (status) member.status = status;

    await member.save();

    const updatedMember = await Member.findById(member._id)
      .populate('user', 'name email phone avatar')
      .populate({ path: 'membership', populate: { path: 'plan' } })
      .populate({ path: 'assignedTrainer', populate: { path: 'user', select: 'name email' } });

    return res.json({
      success: true,
      data: updatedMember
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete member
// @route   DELETE /api/members/:id
// @access  Private (Admin)
const deleteMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    // Remove from assigned trainer
    if (member.assignedTrainer) {
      await Trainer.findByIdAndUpdate(member.assignedTrainer, {
        $pull: { assignedMembers: member._id }
      });
    }

    // Delete related user account
    await User.findByIdAndDelete(member.user);

    // Delete member document
    await Member.findByIdAndDelete(req.params.id);

    return res.json({ success: true, message: 'Member deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember
};
