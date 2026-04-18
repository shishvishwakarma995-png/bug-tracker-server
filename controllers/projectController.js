const Project = require('../models/Project');

const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const project = await Project.create({
      title,
      description: description || '',
      owner: req.user._id,
      members: [req.user._id],
    });

    res.status(201).json(project);
  }  catch (error) {
  console.error('createProject error:', error.stack); // ← change .message to .stack
  res.status(500).json({ message: error.message });
}
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ members: req.user._id })
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('getProjects error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members', 'name email');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    console.error('getProjectById error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    project.title = req.body.title || project.title;
    project.description = req.body.description ?? project.description;
    await project.save();
    res.json(project);
  } catch (error) {
    console.error('updateProject error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await project.deleteOne();
    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('deleteProject error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const inviteMember = async (req, res) => {
  try {
    const { email } = req.body;
    const User = require('../models/User');
    const userToInvite = await User.findOne({ email });
    if (!userToInvite) return res.status(404).json({ message: 'User not found' });

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.members.map(m => m.toString()).includes(userToInvite._id.toString())) {
      return res.status(400).json({ message: 'User already a member' });
    }

    project.members.push(userToInvite._id);
    await project.save();

    const updated = await Project.findById(req.params.id)
      .populate('members', 'name email')
      .populate('owner', 'name email');
    res.json(updated);
  } catch (error) {
    console.error('inviteMember error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const removeMember = async (req, res) => {
  try {
    const { memberId } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    project.members = project.members.filter(m => m.toString() !== memberId.toString());
    await project.save();

    const updated = await Project.findById(req.params.id)
      .populate('members', 'name email')
      .populate('owner', 'name email');
    res.json(updated);
  } catch (error) {
    console.error('removeMember error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  inviteMember,
  removeMember,
};