const WorkoutPlan = require('../models/WorkoutPlan');
const Member = require('../models/Member');
const Trainer = require('../models/Trainer');

// @desc    Get workout plans
// @route   GET /api/workouts
// @access  Private (Admin, Trainer)
const getWorkoutPlans = async (req, res) => {
  try {
    const { memberId, trainerId } = req.query;

    let query = {};
    if (memberId) query.member = memberId;
    if (trainerId) query.trainer = trainerId;

    const workoutPlans = await WorkoutPlan.find(query)
      .populate({
        path: 'member',
        populate: { path: 'user', select: 'name email phone avatar' }
      })
      .populate({
        path: 'trainer',
        populate: { path: 'user', select: 'name email' }
      })
      .sort({ updatedAt: -1 });

    return res.json({ success: true, data: workoutPlans });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get workout plan by ID
// @route   GET /api/workouts/:id
// @access  Private
const getWorkoutPlanById = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id)
      .populate({
        path: 'member',
        populate: { path: 'user', select: 'name email avatar' }
      })
      .populate({
        path: 'trainer',
        populate: { path: 'user', select: 'name email specializations' }
      });

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Workout plan not found' });
    }

    return res.json({ success: true, data: plan });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create or Update workout plan for a member
// @route   POST /api/workouts
// @access  Private (Admin, Trainer)
const createOrUpdateWorkoutPlan = async (req, res) => {
  try {
    const { memberId, planName, goal, durationWeeks, exercises, notes } = req.body;

    if (!memberId) {
      return res.status(400).json({ success: false, message: 'Member ID is required' });
    }

    let trainerId = null;
    if (req.user.role === 'trainer') {
      const trainer = await Trainer.findOne({ user: req.user._id });
      if (trainer) trainerId = trainer._id;
    } else {
      const memberObj = await Member.findById(memberId);
      if (memberObj) trainerId = memberObj.assignedTrainer;
    }

    let existingPlan = await WorkoutPlan.findOne({ member: memberId });

    if (existingPlan) {
      existingPlan.planName = planName || existingPlan.planName;
      existingPlan.goal = goal || existingPlan.goal;
      existingPlan.durationWeeks = durationWeeks || existingPlan.durationWeeks;
      existingPlan.exercises = exercises || existingPlan.exercises;
      existingPlan.notes = notes !== undefined ? notes : existingPlan.notes;
      if (trainerId) existingPlan.trainer = trainerId;

      await existingPlan.save();

      const updated = await WorkoutPlan.findById(existingPlan._id)
        .populate({ path: 'member', populate: { path: 'user', select: 'name email' } })
        .populate({ path: 'trainer', populate: { path: 'user', select: 'name' } });

      return res.json({ success: true, data: updated });
    } else {
      const newPlan = await WorkoutPlan.create({
        member: memberId,
        trainer: trainerId,
        planName: planName || 'Chest & Conditioning Routine',
        goal: goal || 'Muscle Gain & Strength',
        durationWeeks: durationWeeks || 4,
        exercises: exercises || [],
        notes: notes || ''
      });

      const populated = await WorkoutPlan.findById(newPlan._id)
        .populate({ path: 'member', populate: { path: 'user', select: 'name email' } })
        .populate({ path: 'trainer', populate: { path: 'user', select: 'name' } });

      return res.status(201).json({ success: true, data: populated });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete workout plan
// @route   DELETE /api/workouts/:id
// @access  Private (Admin, Trainer)
const deleteWorkoutPlan = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findByIdAndDelete(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Workout plan not found' });
    }
    return res.json({ success: true, message: 'Workout plan deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in member's assigned workout plan
// @route   GET /api/workouts/my
// @access  Private (Member)
const getMyWorkoutPlan = async (req, res) => {
  try {
    const member = await Member.findOne({ user: req.user._id });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member profile not found' });
    }

    const plan = await WorkoutPlan.findOne({ member: member._id })
      .populate({
        path: 'trainer',
        populate: { path: 'user', select: 'name email phone avatar' }
      })
      .sort({ updatedAt: -1 });

    return res.json({ success: true, data: plan });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getWorkoutPlans,
  getWorkoutPlanById,
  createOrUpdateWorkoutPlan,
  deleteWorkoutPlan,
  getMyWorkoutPlan
};
