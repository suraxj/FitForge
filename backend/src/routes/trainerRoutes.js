const express = require('express');
const router = express.Router();
const {
  getTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  deleteTrainer,
  getMyAssignedMembers
} = require('../controllers/trainerController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/members/assigned', authorize('trainer'), getMyAssignedMembers);

router.route('/')
  .get(getTrainers)
  .post(authorize('admin'), createTrainer);

router.route('/:id')
  .get(getTrainerById)
  .put(authorize('admin'), updateTrainer)
  .delete(authorize('admin'), deleteTrainer);

module.exports = router;
