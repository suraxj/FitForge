const express = require('express');
const router = express.Router();
const {
  getMemberships,
  assignMembership,
  updateMembership,
  deleteMembership,
  getMyMembership
} = require('../controllers/membershipController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/my', authorize('member'), getMyMembership);

router.route('/')
  .get(authorize('admin'), getMemberships)
  .post(authorize('admin'), assignMembership);

router.route('/:id')
  .put(authorize('admin'), updateMembership)
  .delete(authorize('admin'), deleteMembership);

module.exports = router;
