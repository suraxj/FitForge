const MembershipPlan = require('../models/MembershipPlan');

// @desc    Get all membership plans
// @route   GET /api/plans
// @access  Public / Private
const getPlans = async (req, res) => {
  try {
    const query = req.user && req.user.role === 'admin' ? {} : { status: 'active' };
    const plans = await MembershipPlan.find(query).sort({ price: 1 });
    return res.json({ success: true, data: plans });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new membership plan (Admin)
// @route   POST /api/plans
// @access  Private (Admin)
const createPlan = async (req, res) => {
  try {
    const { name, durationMonths, price, description, features, status } = req.body;

    if (!name || !durationMonths || price === undefined) {
      return res.status(400).json({ success: false, message: 'Name, duration, and price are required' });
    }

    const plan = await MembershipPlan.create({
      name,
      durationMonths: Number(durationMonths),
      price: Number(price),
      description: description || '',
      features: Array.isArray(features) ? features : (features || '').split(',').map((f) => f.trim()).filter(Boolean),
      status: status || 'active'
    });

    return res.status(201).json({ success: true, data: plan });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update membership plan (Admin)
// @route   PUT /api/plans/:id
// @access  Private (Admin)
const updatePlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    const { name, durationMonths, price, description, features, status } = req.body;

    if (name) plan.name = name;
    if (durationMonths !== undefined) plan.durationMonths = Number(durationMonths);
    if (price !== undefined) plan.price = Number(price);
    if (description !== undefined) plan.description = description;
    if (features !== undefined) {
      plan.features = Array.isArray(features) ? features : (features || '').split(',').map((f) => f.trim()).filter(Boolean);
    }
    if (status) plan.status = status;

    await plan.save();
    return res.json({ success: true, data: plan });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete membership plan (Admin)
// @route   DELETE /api/plans/:id
// @access  Private (Admin)
const deletePlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.findByIdAndDelete(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }
    return res.json({ success: true, message: 'Plan deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan
};
