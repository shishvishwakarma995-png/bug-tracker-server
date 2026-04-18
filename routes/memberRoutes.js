const express = require('express');
const router = express.Router({ mergeParams: true });
const { getMembers, addMember, removeMember } = require('../controllers/memberController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.route('/').get(getMembers).post(addMember);
router.route('/:userId').delete(removeMember);

module.exports = router;