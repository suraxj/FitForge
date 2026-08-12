const Membership = require('../models/Membership');
const MembershipPlan = require('../models/MembershipPlan');
const Member = require('../models/Member');
const Payment = require('../models/Payment');

// @desc    Get all memberships with auto-calculated expiry warnings
// @route   GET /api/memberships
// @access  Private (Admin)
const getMemberships = async (req, res) => {
  try {
    const { status, search } = req.query;

    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const memberships = await Membership.find(query)
      .populate({
        path: 'member',
        populate: { path: 'user', select: 'name email phone avatar' }
      })
      .populate('plan')
      .sort({ createdAt: -1 });

    // Refresh status for each membership before returning
    const updatedMemberships = await Promise.all(
      memberships.map(async (m) => {
        const now = new Date();
        const warningDate = new Date();
        warningDate.setDate(warningDate.getDate() + 7);

        let newStatus = m.status;
        if (m.expiryDate < now) {
          newStatus = 'expired';
        } else if (m.expiryDate <= warningDate) {
          newStatus = 'expiring_soon';
        } else {
          newStatus = 'active';
        }

        if (newStatus !== m.status) {
          m.status = newStatus;
          await m.save();
          if (m.member) {
            await Member.findByIdAndUpdate(m.member._id, { status: newStatus === 'expired' ? 'expired' : 'active' });
          }
        }
        return m;
      })
    );

    return res.json({ success: true, data: updatedMemberships });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign plan to member (Admin)
// @route   POST /api/memberships
// @access  Private (Admin)
const assignMembership = async (req, res) => {
  try {
    const { memberId, planId, startDate, paymentMethod, isPaid } = req.body;

    if (!memberId || !planId) {
      return res.status(400).json({ success: false, message: 'Member and Plan are required' });
    }

    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    const plan = await MembershipPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Membership plan not found' });
    }

    const start = startDate ? new Date(startDate) : new Date();
    const expiry = new Date(start);
    expiry.setMonth(expiry.getMonth() + plan.durationMonths);

    const paymentStatus = isPaid ? 'paid' : 'pending';

    const membership = await Membership.create({
      member: memberId,
      plan: planId,
      startDate: start,
      expiryDate: expiry,
      amount: plan.price,
      paymentStatus,
      status: expiry < new Date() ? 'expired' : 'active'
    });

    // Create payment record
    const payment = await Payment.create({
      member: memberId,
      membership: membership._id,
      amount: plan.price,
      paymentDate: new Date(),
      paymentMethod: paymentMethod || 'Cash',
      status: paymentStatus
    });

    // Link membership to member
    member.membership = membership._id;
    member.status = 'active';
    await member.save();

    const populatedMembership = await Membership.findById(membership._id)
      .populate({
        path: 'member',
        populate: { path: 'user', select: 'name email phone' }
      })
      .populate('plan');

    return res.status(201).json({
      success: true,
      data: {
        membership: populatedMembership,
        payment
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update membership
// @route   PUT /api/memberships/:id
// @access  Private (Admin)
const updateMembership = async (req, res) => {
  try {
    const membership = await Membership.findById(req.params.id);
    if (!membership) {
      return res.status(404).json({ success: false, message: 'Membership not found' });
    }

    const { expiryDate, paymentStatus, status } = req.body;
    if (expiryDate) membership.expiryDate = new Date(expiryDate);
    if (paymentStatus) membership.paymentStatus = paymentStatus;
    if (status) membership.status = status;

    await membership.save();

    const updated = await Membership.findById(membership._id)
      .populate({
        path: 'member',
        populate: { path: 'user', select: 'name email' }
      })
      .populate('plan');

    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete/Cancel membership
// @route   DELETE /api/memberships/:id
// @access  Private (Admin)
const deleteMembership = async (req, res) => {
  try {
    const membership = await Membership.findById(req.params.id);
    if (!membership) {
      return res.status(404).json({ success: false, message: 'Membership not found' });
    }

    await Member.findByIdAndUpdate(membership.member, { membership: null, status: 'expired' });
    await Membership.findByIdAndDelete(req.params.id);

    return res.json({ success: true, message: 'Membership deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in member's active membership
// @route   GET /api/memberships/my
// @access  Private (Member)
const getMyMembership = async (req, res) => {
  try {
    const member = await Member.findOne({ user: req.user._id });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member profile not found' });
    }

    const membership = await Membership.findOne({ member: member._id })
      .populate('plan')
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: membership });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMemberships,
  assignMembership,
  updateMembership,
  deleteMembership,
  getMyMembership
};
