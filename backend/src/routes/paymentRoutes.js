const express = require('express');
const router = express.Router();
const {
  getPayments,
  getPaymentById,
  createPayment,
  updatePaymentStatus,
  getMyPayments
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/my', authorize('member'), getMyPayments);

router.route('/')
  .get(authorize('admin'), getPayments)
  .post(authorize('admin'), createPayment);

router.get('/:id', getPaymentById);
router.put('/:id/status', authorize('admin'), updatePaymentStatus);

module.exports = router;
