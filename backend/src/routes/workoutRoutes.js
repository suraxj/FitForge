const express = require('express');
const router = express.Router();
const {
  getWorkoutPlans,
  getWorkoutPlanById,
  createOrUpdateWorkoutPlan,
  deleteWorkoutPlan,
  getMyWorkoutPlan
} = require('../controllers/workoutController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/my', authorize('member'), getMyWorkoutPlan);

router.route('/')
  .get(authorize('admin', 'trainer'), getWorkoutPlans)
  .post(authorize('admin', 'trainer'), createOrUpdateWorkoutPlan);

router.route('/:id')
  .get(getWorkoutPlanById)
  .delete(authorize('admin', 'trainer'), deleteWorkoutPlan);

module.exports = router;
