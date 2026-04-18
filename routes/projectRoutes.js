const express = require('express');
const router = express.Router();
const { createProject, getProjects, getProjectById, updateProject, deleteProject, inviteMember, removeMember } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.route('/').get(getProjects).post(createProject);
router.route('/:id').get(getProjectById).put(updateProject).delete(deleteProject);
router.put('/:id/invite', inviteMember);
router.put('/:id/remove-member', removeMember);

module.exports = router;