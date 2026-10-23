const express = require('express');
const { createReview, getAdvocateReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

const router = express.Router();

router.post('/', protect, authorize('client'), createReview);
router.get('/advocate/:advocateId', getAdvocateReviews);
router.get('/:id', getAdvocateReviews);

module.exports = router;
