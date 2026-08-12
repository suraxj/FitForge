const Member = require('../models/Member');
const Trainer = require('../models/Trainer');
const Membership = require('../models/Membership');
const MembershipPlan = require('../models/MembershipPlan');
const Payment = require('../models/Payment');
const Attendance = require('../models/Attendance');
const User = require('../models/User');

// @desc    Get Admin Dashboard Stats & Chart Analytics
// @route   GET /api/dashboard/stats
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
  try {
    const totalMembers = await Member.countDocuments();
    const activeMembers = await Member.countDocuments({ status: 'active' });
    const expiredMembers = await Member.countDocuments({ status: 'expired' });
    const totalTrainers = await Trainer.countDocuments({ status: 'active' });
    const activeMemberships = await Membership.countDocuments({ status: { $in: ['active', 'expiring_soon'] } });

    // Revenue calculations
    const payments = await Payment.find({ status: 'paid' });
    const totalRevenue = payments.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    // Monthly revenue (current month)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyPayments = await Payment.find({
      status: 'paid',
      paymentDate: { $gte: startOfMonth }
    });
    const monthlyRevenue = monthlyPayments.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    // Pending Payments count & total
    const pendingPaymentsList = await Payment.find({ status: 'pending' });
    const pendingPaymentsCount = pendingPaymentsList.length;
    const pendingPaymentsAmount = pendingPaymentsList.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    // Today's Attendance
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayAttendanceCount = await Attendance.countDocuments({
      date: { $gte: todayStart, $lte: todayEnd },
      status: 'present'
    });

    // 6-Month Revenue & Member Growth Breakdown
    const monthsData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const monthLabel = d.toLocaleString('default', { month: 'short' });

      const monthPayments = await Payment.find({
        status: 'paid',
        paymentDate: { $gte: d, $lte: monthEnd }
      });
      const rev = monthPayments.reduce((acc, curr) => acc + (curr.amount || 0), 0);

      const newMembersCount = await Member.countDocuments({
        createdAt: { $gte: d, $lte: monthEnd }
      });

      monthsData.push({
        month: monthLabel,
        revenue: rev,
        members: newMembersCount
      });
    }

    // Attendance Breakdown (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const presentCount = await Attendance.countDocuments({ date: { $gte: thirtyDaysAgo }, status: 'present' });
    const absentCount = await Attendance.countDocuments({ date: { $gte: thirtyDaysAgo }, status: 'absent' });
    const lateCount = await Attendance.countDocuments({ date: { $gte: thirtyDaysAgo }, status: 'late' });

    // Membership Plan Distribution
    const plans = await MembershipPlan.find();
    const planDistribution = await Promise.all(
      plans.map(async (plan) => {
        const count = await Membership.countDocuments({ plan: plan._id, status: { $in: ['active', 'expiring_soon'] } });
        return {
          name: plan.name,
          value: count
        };
      })
    );

    // Recent Activity Feed
    const recentRegistrations = await Member.find()
      .populate('user', 'name email phone avatar createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentPayments = await Payment.find()
      .populate({
        path: 'member',
        populate: { path: 'user', select: 'name email' }
      })
      .sort({ paymentDate: -1 })
      .limit(5);

    const expiringMemberships = await Membership.find({
      status: 'expiring_soon'
    })
      .populate({
        path: 'member',
        populate: { path: 'user', select: 'name email phone' }
      })
      .populate('plan', 'name')
      .limit(5);

    return res.json({
      success: true,
      data: {
        summary: {
          totalMembers,
          activeMembers,
          expiredMembers,
          totalTrainers,
          activeMemberships,
          totalRevenue,
          monthlyRevenue,
          pendingPaymentsCount,
          pendingPaymentsAmount,
          todayAttendanceCount
        },
        charts: {
          monthlyRevenueAndGrowth: monthsData,
          attendanceStats: [
            { name: 'Present', value: presentCount },
            { name: 'Absent', value: absentCount },
            { name: 'Late', value: lateCount }
          ],
          planDistribution
        },
        recentActivity: {
          registrations: recentRegistrations,
          payments: recentPayments,
          expiringMemberships
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAdminStats
};
