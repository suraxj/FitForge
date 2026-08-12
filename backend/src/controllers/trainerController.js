const Trainer = require('../models/Trainer');
const User = require('../models/User');
const Member = require('../models/Member');

// @desc    Get all trainers
// @route   GET /api/trainers
// @access  Private
const getTrainers = async (req, res) => {
  try {
    const { search, specialization } = req.query;

    let query = {};
    if (specialization) {
      query.specializations = { $in: [new RegExp(specialization, 'i')] };
    }

    if (search) {
      const matchingUsers = await User.find({
        role: 'trainer',
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      const userIds = matchingUsers.map((u) => u._id);
      query.user = { $in: userIds };
    }

    const trainers = await Trainer.find(query)
      .populate('user', 'name email phone avatar createdAt')
      .populate({
        path: 'assignedMembers',
        populate: { path: 'user', select: 'name email phone' }
      })
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: trainers
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single trainer details
// @route   GET /api/trainers/:id
// @access  Private
const getTrainerById = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id)
      .populate('user', 'name email phone avatar createdAt')
      .populate({
        path: 'assignedMembers',
        populate: [
          { path: 'user', select: 'name email phone avatar' },
          { path: 'membership', populate: { path: 'plan', select: 'name' } }
        ]
      });

    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    return res.json({
      success: true,
      data: trainer
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new trainer (Admin)
// @route   POST /api/trainers
// @access  Private (Admin)
const createTrainer = async (req, res) => {
  try {
    const { name, email, phone, password, specializations, experience, bio, salary, status } = req.body;

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
      role: 'trainer'
    });

    const trainer = await Trainer.create({
      user: user._id,
      specializations: Array.isArray(specializations) ? specializations : (specializations || '').split(',').map((s) => s.trim()).filter(Boolean),
      experience: experience || 0,
      bio: bio || '',
      salary: salary || 0,
      status: status || 'active'
    });

    const populatedTrainer = await Trainer.findById(trainer._id).populate('user', 'name email phone avatar');

    return res.status(201).json({
      success: true,
      data: populatedTrainer
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update trainer (Admin)
// @route   PUT /api/trainers/:id
// @access  Private (Admin)
const updateTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    const { name, phone, specializations, experience, bio, salary, status } = req.body;

    const user = await User.findById(trainer.user);
    if (user) {
      if (name) user.name = name;
      if (phone) user.phone = phone;
      await user.save();
    }

    if (specializations !== undefined) {
      trainer.specializations = Array.isArray(specializations) ? specializations : (specializations || '').split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (experience !== undefined) trainer.experience = experience;
    if (bio !== undefined) trainer.bio = bio;
    if (salary !== undefined) trainer.salary = salary;
    if (status) trainer.status = status;

    await trainer.save();

    const updatedTrainer = await Trainer.findById(trainer._id).populate('user', 'name email phone avatar');

    return res.json({
      success: true,
      data: updatedTrainer
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete trainer (Admin)
// @route   DELETE /api/trainers/:id
// @access  Private (Admin)
const deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    // Unassign trainer from members
    await Member.updateMany({ assignedTrainer: trainer._id }, { $set: { assignedTrainer: null } });

    // Delete user
    await User.findByIdAndDelete(trainer.user);

    // Delete trainer
    await Trainer.findByIdAndDelete(req.params.id);

    return res.json({ success: true, message: 'Trainer deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get assigned members for a trainer
// @route   GET /api/trainers/members/assigned
// @access  Private (Trainer)
const getMyAssignedMembers = async (req, res) => {
  try {
    const trainer = await Trainer.findOne({ user: req.user._id });
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer profile not found' });
    }

    const members = await Member.find({ assignedTrainer: trainer._id })
      .populate('user', 'name email phone avatar')
      .populate({ path: 'membership', populate: { path: 'plan', select: 'name' } });

    return res.json({
      success: true,
      data: members
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  deleteTrainer,
  getMyAssignedMembers
};
