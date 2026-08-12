const User = require('../models/User');
const Member = require('../models/Member');
const Trainer = require('../models/Trainer');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user (Member role only)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Please enter all required fields' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // Force role to member for public registration
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role: 'member'
    });

    if (user) {
      // Create associated Member profile
      const member = await Member.create({
        user: user._id,
        status: 'active'
      });

      const token = generateToken(res, user._id);

      return res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
          memberId: member._id,
          token
        }
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(res, user._id);

      let roleProfile = null;
      if (user.role === 'member') {
        roleProfile = await Member.findOne({ user: user._id }).populate('membership assignedTrainer');
      } else if (user.role === 'trainer') {
        roleProfile = await Trainer.findOne({ user: user._id });
      }

      return res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
          roleProfile,
          token
        }
      });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  return res.json({ success: true, message: 'Logged out successfully' });
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let roleProfile = null;

    if (user.role === 'member') {
      roleProfile = await Member.findOne({ user: user._id })
        .populate({
          path: 'membership',
          populate: { path: 'plan' }
        })
        .populate({
          path: 'assignedTrainer',
          populate: { path: 'user', select: 'name email phone avatar' }
        });
    } else if (user.role === 'trainer') {
      roleProfile = await Trainer.findOne({ user: user._id }).populate({
        path: 'assignedMembers',
        populate: { path: 'user', select: 'name email phone' }
      });
    }

    return res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        roleProfile
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      if (req.body.avatar !== undefined) user.avatar = req.body.avatar;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      // If member role, allow updating member fields
      if (user.role === 'member') {
        const member = await Member.findOne({ user: user._id });
        if (member) {
          if (req.body.gender) member.gender = req.body.gender;
          if (req.body.address !== undefined) member.address = req.body.address;
          if (req.body.emergencyContact) {
            member.emergencyContact = { ...member.emergencyContact, ...req.body.emergencyContact };
          }
          await member.save();
        }
      }

      return res.json({
        success: true,
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          role: updatedUser.role,
          avatar: updatedUser.avatar
        }
      });
    } else {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updateProfile
};
