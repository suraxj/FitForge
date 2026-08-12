const Payment = require('../models/Payment');
const Membership = require('../models/Membership');
const Member = require('../models/Member');
const User = require('../models/User');

// @desc    Get payments with search, status & date filtering
// @route   GET /api/payments
// @access  Private (Admin)
const getPayments = async (req, res) => {
  try {
    const { status, method, search, startDate, endDate, page = 1, limit = 10 } = req.query;

    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (method && method !== 'all') {
      query.paymentMethod = method;
    }
    if (startDate || endDate) {
      query.paymentDate = {};
      if (startDate) query.paymentDate.$gte = new Date(startDate);
      if (endDate) query.paymentDate.$lte = new Date(endDate);
    }

    if (search) {
      const matchingUsers = await User.find({
        name: { $regex: search, $options: 'i' }
      }).select('_id');
      const matchingMembers = await Member.find({ user: { $in: matchingUsers.map((u) => u._id) } }).select('_id');
      query.member = { $in: matchingMembers.map((m) => m._id) };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Payment.countDocuments(query);

    const payments = await Payment.find(query)
      .populate({
        path: 'member',
        populate: { path: 'user', select: 'name email phone' }
      })
      .populate({
        path: 'membership',
        populate: { path: 'plan', select: 'name price' }
      })
      .sort({ paymentDate: -1 })
      .skip(skip)
      .limit(Number(limit));

    return res.json({
      success: true,
      data: {
        payments,
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single payment & printable receipt details
// @route   GET /api/payments/:id
// @access  Private
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate({
        path: 'member',
        populate: [
          { path: 'user', select: 'name email phone avatar' },
          { path: 'assignedTrainer', populate: { path: 'user', select: 'name' } }
        ]
      })
      .populate({
        path: 'membership',
        populate: { path: 'plan' }
      });

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    return res.json({ success: true, data: payment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Log payment / Update payment status (Admin)
// @route   POST /api/payments
// @access  Private (Admin)
const createPayment = async (req, res) => {
  try {
    const { memberId, membershipId, amount, paymentMethod, status, notes } = req.body;

    if (!memberId || amount === undefined) {
      return res.status(400).json({ success: false, message: 'Member ID and Amount are required' });
    }

    const payment = await Payment.create({
      member: memberId,
      membership: membershipId || null,
      amount: Number(amount),
      paymentMethod: paymentMethod || 'Cash',
      status: status || 'paid',
      notes: notes || ''
    });

    if (membershipId && (status === 'paid' || status === undefined)) {
      await Membership.findByIdAndUpdate(membershipId, { paymentStatus: 'paid' });
    }

    const populatedPayment = await Payment.findById(payment._id)
      .populate({
        path: 'member',
        populate: { path: 'user', select: 'name email phone' }
      })
      .populate('membership');

    return res.status(201).json({ success: true, data: populatedPayment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update payment status (e.g. pending -> paid)
// @route   PUT /api/payments/:id/status
// @access  Private (Admin)
const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    payment.status = status;
    await payment.save();

    if (payment.membership && status === 'paid') {
      await Membership.findByIdAndUpdate(payment.membership, { paymentStatus: 'paid' });
    }

    return res.json({ success: true, data: payment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get member's own payment history
// @route   GET /api/payments/my
// @access  Private (Member)
const getMyPayments = async (req, res) => {
  try {
    const member = await Member.findOne({ user: req.user._id });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member profile not found' });
    }

    const payments = await Payment.find({ member: member._id })
      .populate({
        path: 'membership',
        populate: { path: 'plan', select: 'name' }
      })
      .sort({ paymentDate: -1 });

    return res.json({ success: true, data: payments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPayments,
  getPaymentById,
  createPayment,
  updatePaymentStatus,
  getMyPayments
};
