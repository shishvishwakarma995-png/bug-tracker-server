const Sprint = require('../models/Sprint');
const Ticket = require('../models/Ticket');

const getSprints = async (req, res) => {
  try {
    const sprints = await Sprint.find({ project: req.params.projectId }).sort({ createdAt: -1 });
    res.json(sprints);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

const createSprint = async (req, res) => {
  try {
    const { name, startDate, endDate, goal } = req.body;
    const sprint = await Sprint.create({ name, startDate, endDate, goal, project: req.params.projectId });
    res.status(201).json(sprint);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

const updateSprint = async (req, res) => {
  try {
    const sprint = await Sprint.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(sprint);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

const deleteSprint = async (req, res) => {
  try {
    await Sprint.findByIdAndDelete(req.params.id);
    await Ticket.updateMany({ sprint: req.params.id }, { sprint: null });
    res.json({ message: 'Sprint deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

const getSprintTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ sprint: req.params.id })
      .populate('assignee', 'name email')
      .populate('createdBy', 'name');
    res.json(tickets);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

module.exports = { getSprints, createSprint, updateSprint, deleteSprint, getSprintTickets };