const express = require('express');
const router = express.Router();
const { getProgressByMember, addProgress, deleteProgress, getMyProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/my', authorize('member'), getMyProgress);
router.get('/member/:memberId', getProgressByMember);

router.post('/', authorize('admin', 'trainer', 'member'), addProgress);
router.delete('/:id', authorize('admin', 'trainer'), deleteProgress);

module.exports = router;
