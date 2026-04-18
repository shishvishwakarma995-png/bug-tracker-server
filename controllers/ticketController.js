const Ticket = require('../models/Ticket');

const createTicket = async (req, res) => {
  try {
    const { title, description, priority, type, assignee, dueDate, sprint } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const ticket = await Ticket.create({
      title,
      description: description || '',
      priority: priority || 'medium',
      type: type || 'bug',
      project: req.params.projectId,
      assignee: assignee || null,
      createdBy: req.user._id,
      dueDate: dueDate || null,
      sprint: sprint || null,
    });

    res.status(201).json(ticket);
  } catch (error) {
    console.error('createTicket error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ project: req.params.projectId })
      .populate('assignee', 'name email')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    console.error('getTickets error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const allowedFields = ['title', 'description', 'status', 'priority', 'type', 'assignee', 'dueDate', 'sprint'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        ticket[field] = req.body[field];
      }
    });

    await ticket.save();
    res.json(ticket);
  } catch (error) {
    console.error('updateTicket error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    await ticket.deleteOne();
    res.json({ message: 'Ticket deleted' });
  } catch (error) {
    console.error('deleteTicket error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTicket, getTickets, updateTicket, deleteTicket };