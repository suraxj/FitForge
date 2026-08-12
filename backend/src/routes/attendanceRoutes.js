const express = require('express');
const router = express.Router();
const { markAttendance, getAttendance, getMyAttendance } = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/my', authorize('member'), getMyAttendance);

router.route('/')
  .get(authorize('admin', 'trainer'), getAttendance)
  .post(authorize('admin', 'trainer'), markAttendance);

module.exports = router;
