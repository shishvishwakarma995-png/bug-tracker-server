const express = require('express');
const router = express.Router({ mergeParams: true });
const { getSprints, createSprint, updateSprint, deleteSprint, getSprintTickets } = require('../controllers/sprintController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.route('/').get(getSprints).post(createSprint);
router.route('/:id').put(updateSprint).delete(deleteSprint);
router.get('/:id/tickets', getSprintTickets);

module.exports = router;