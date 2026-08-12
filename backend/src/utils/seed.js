const mongoose = require('mongoose');

const User = require('../models/User');
const Member = require('../models/Member');
const Trainer = require('../models/Trainer');
const MembershipPlan = require('../models/MembershipPlan');
const Membership = require('../models/Membership');
const Payment = require('../models/Payment');
const Attendance = require('../models/Attendance');
const WorkoutPlan = require('../models/WorkoutPlan');
const Progress = require('../models/Progress');
const Announcement = require('../models/Announcement');

const seedData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('[Seed] Database already populated with users. Skipping initial seed.');
      return;
    }

    console.log('[Seed] Database empty. Seeding default demo data...');

    // 1. Admin
    const adminUser = await User.create({
      name: 'FitForge Admin',
      email: 'admin@gym.com',
      phone: '+1 (555) 019-2831',
      password: 'Admin@123',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    });

    // 2. Primary Demo Trainer
    const trainerUser1 = await User.create({
      name: 'Viktor Vance',
      email: 'trainer@gym.com',
      phone: '+1 (555) 012-9988',
      password: 'Trainer@123',
      role: 'trainer',
      avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=150&auto=format&fit=crop&q=80'
    });

    // 3. Additional Trainers
    const trainerUser2 = await User.create({
      name: 'Sarah Jenkins',
      email: 'sarah@gym.com',
      phone: '+1 (555) 014-8822',
      password: 'Trainer@123',
      role: 'trainer',
      avatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=150&auto=format&fit=crop&q=80'
    });

    const trainer1 = await Trainer.create({
      user: trainerUser1._id,
      specializations: ['Strength Training', 'Bodybuilding', 'CrossFit'],
      experience: 7,
      bio: 'Certified master strength coach specializing in hypertrophy, Olympic weightlifting, and peak athletic performance.',
      salary: 5500,
      status: 'active'
    });

    const trainer2 = await Trainer.create({
      user: trainerUser2._id,
      specializations: ['Cardio & Endurance', 'Yoga', 'HIIT'],
      experience: 5,
      bio: 'Passionate fitness enthusiast helping clients transform endurance, posture, flexibility, and sustainable weight loss.',
      salary: 4800,
      status: 'active'
    });

    // 4. Membership Plans
    const planBasic = await MembershipPlan.create({
      name: 'Basic',
      durationMonths: 1,
      price: 49,
      description: 'Ideal for beginners starting their fitness journey with essential equipment access.',
      features: ['Full Gym Floor Access', 'Locker Room & Showers', 'Basic Fitness Assessment', 'FitForge Mobile App Access'],
      status: 'active'
    });

    const planStandard = await MembershipPlan.create({
      name: 'Standard',
      durationMonths: 3,
      price: 129,
      description: 'Our most popular tier featuring guided support, trainer consults, and customized workout schedules.',
      features: ['Full Gym & Heavy Lift Zone', 'Trainer Support Consultations', 'Custom Diet & Nutrition Guide', 'Group Fitness Classes', 'Progress Tracking Dashboard'],
      status: 'active'
    });

    const planPremium = await MembershipPlan.create({
      name: 'Premium VIP',
      durationMonths: 12,
      price: 399,
      description: 'The ultimate fitness package with unlimited access, 1-on-1 personal coaching, and VIP amenities.',
      features: ['24/7 Unlimited Facility Access', 'Dedicated Personal Trainer', 'Personalized Workout & Meal Plan', 'Sauna & Recovery Zone Access', 'Monthly Body Composition Scan'],
      status: 'active'
    });

    // 5. Primary Demo Member
    const memberUser1 = await User.create({
      name: 'Alex Johnson',
      email: 'member@gym.com',
      phone: '+1 (555) 018-7744',
      password: 'Member@123',
      role: 'member',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    });

    const memberUser2 = await User.create({
      name: 'Emily Davis',
      email: 'emily@gym.com',
      phone: '+1 (555) 013-3311',
      password: 'Member@123',
      role: 'member',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
    });

    const memberUser3 = await User.create({
      name: 'Michael Carter',
      email: 'michael@gym.com',
      phone: '+1 (555) 016-5599',
      password: 'Member@123',
      role: 'member',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    });

    const member1 = await Member.create({
      user: memberUser1._id,
      gender: 'Male',
      dateOfBirth: new Date('1996-05-14'),
      address: '742 Evergreen Terrace, Springfield',
      emergencyContact: { name: 'Karen Johnson', phone: '+1 (555) 018-9900', relation: 'Mother' },
      assignedTrainer: trainer1._id,
      status: 'active'
    });

    const member2 = await Member.create({
      user: memberUser2._id,
      gender: 'Female',
      dateOfBirth: new Date('1998-11-20'),
      address: '104 Lincoln Blvd, Chicago',
      emergencyContact: { name: 'Mark Davis', phone: '+1 (555) 013-4400', relation: 'Spouse' },
      assignedTrainer: trainer2._id,
      status: 'active'
    });

    const member3 = await Member.create({
      user: memberUser3._id,
      gender: 'Male',
      dateOfBirth: new Date('1992-02-10'),
      address: '55 Park Avenue, New York',
      emergencyContact: { name: 'David Carter', phone: '+1 (555) 016-1122', relation: 'Brother' },
      assignedTrainer: trainer1._id,
      status: 'active'
    });

    trainer1.assignedMembers = [member1._id, member3._id];
    await trainer1.save();

    trainer2.assignedMembers = [member2._id];
    await trainer2.save();

    // 6. Memberships
    const now = new Date();
    const startDate1 = new Date(now.getFullYear(), now.getMonth() - 1, 15);
    const expiryDate1 = new Date(startDate1);
    expiryDate1.setMonth(expiryDate1.getMonth() + planStandard.durationMonths);

    const membership1 = await Membership.create({
      member: member1._id,
      plan: planStandard._id,
      startDate: startDate1,
      expiryDate: expiryDate1,
      amount: planStandard.price,
      paymentStatus: 'paid',
      status: 'active'
    });
    member1.membership = membership1._id;
    await member1.save();

    await Payment.create({
      member: member1._id,
      membership: membership1._id,
      amount: planStandard.price,
      paymentDate: startDate1,
      paymentMethod: 'UPI',
      transactionId: 'TXN-99482103',
      receiptNumber: 'REC-104921',
      status: 'paid',
      notes: 'Initial 3-Month Standard Plan Payment'
    });

    // 7. Workout Plans
    await WorkoutPlan.create({
      member: member1._id,
      trainer: trainer1._id,
      title: 'Hypertrophy & Strength Split',
      level: 'Intermediate',
      description: 'Targeted chest & tricep strength program',
      schedule: [
        {
          day: 'Monday',
          focusArea: 'Chest & Triceps',
          exercises: [
            { name: 'Barbell Bench Press', sets: 4, reps: '8-10', targetMuscle: 'Chest', restTime: 90 },
            { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', targetMuscle: 'Upper Chest', restTime: 60 },
            { name: 'Tricep Rope Pushdowns', sets: 4, reps: '12-15', targetMuscle: 'Triceps', restTime: 45 }
          ]
        },
        {
          day: 'Wednesday',
          focusArea: 'Back & Biceps',
          exercises: [
            { name: 'Lat Pulldown', sets: 4, reps: '10-12', targetMuscle: 'Lats', restTime: 60 },
            { name: 'Barbell Rows', sets: 3, reps: '8-10', targetMuscle: 'Mid Back', restTime: 90 },
            { name: 'Hammer Curls', sets: 3, reps: '12', targetMuscle: 'Biceps', restTime: 45 }
          ]
        },
        {
          day: 'Friday',
          focusArea: 'Legs & Shoulders',
          exercises: [
            { name: 'Barbell Squats', sets: 4, reps: '8-10', targetMuscle: 'Quads', restTime: 90 },
            { name: 'Overhead Press', sets: 3, reps: '10', targetMuscle: 'Deltoids', restTime: 60 }
          ]
        }
      ]
    });

    // 8. Progress Logs
    const pDates = [
      new Date(now.getFullYear(), now.getMonth() - 2, 1),
      new Date(now.getFullYear(), now.getMonth() - 1, 1),
      new Date(now.getFullYear(), now.getMonth(), 1)
    ];

    await Progress.create({
      member: member1._id,
      weight: 82,
      height: 180,
      bodyFatPercentage: 21,
      chest: 40,
      waist: 34,
      arms: 14,
      date: pDates[0],
      recordedBy: trainerUser1._id
    });

    await Progress.create({
      member: member1._id,
      weight: 80,
      height: 180,
      bodyFatPercentage: 19,
      chest: 41,
      waist: 33,
      arms: 14.5,
      date: pDates[1],
      recordedBy: trainerUser1._id
    });

    await Progress.create({
      member: member1._id,
      weight: 78.5,
      height: 180,
      bodyFatPercentage: 17.5,
      chest: 42,
      waist: 32,
      arms: 15,
      date: pDates[2],
      recordedBy: trainerUser1._id
    });

    // 9. Announcements
    await Announcement.create({
      title: '🏋️ New Power Racks & Dumbbell Zone!',
      message: 'We have upgraded our strength area with brand new Rogue power cages and dumbells up to 50kg.',
      priority: 'important',
      author: adminUser._id
    });

    await Announcement.create({
      title: '⏰ Holiday Operating Hours',
      message: 'Anytime Fitness will operate on holiday schedule (8:00 AM - 6:00 PM) this Sunday.',
      priority: 'normal',
      author: adminUser._id
    });

    console.log('[Seed] Database successfully seeded with demo accounts & data!');
  } catch (error) {
    console.error('[Seed] Error seeding database:', error.message);
  }
};

module.exports = seedData;
