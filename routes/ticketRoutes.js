const express = require('express');
const router = express.Router({ mergeParams: true });
const { createTicket, getTickets, updateTicket, deleteTicket } = require('../controllers/ticketController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.route('/').get(getTickets).post(createTicket);
router.route('/:id').put(updateTicket).delete(deleteTicket);

module.exports = router;