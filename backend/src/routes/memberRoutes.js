const express = require('express');
const router = express.Router();
const { getMembers, getMemberById, createMember, updateMember, deleteMember } = require('../controllers/memberController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.route('/')
  .get(authorize('admin', 'trainer'), getMembers)
  .post(authorize('admin'), createMember);

router.route('/:id')
  .get(authorize('admin', 'trainer', 'member'), getMemberById)
  .put(authorize('admin', 'trainer'), updateMember)
  .delete(authorize('admin'), deleteMember);

module.exports = router;
