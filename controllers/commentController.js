const Comment = require('../models/Comment');

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ ticket: req.params.ticketId })
      .populate('author', 'name email')
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (error) {
    console.error('getComments error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text required' });
    }

    const comment = await Comment.create({
      text: text.trim(),
      ticket: req.params.ticketId,
      author: req.user._id,
    });

    const populated = await Comment.findById(comment._id)
      .populate('author', 'name email');
    res.status(201).json(populated);
  } catch (error) {
    console.error('addComment error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await comment.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (error) {
    console.error('deleteComment error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getComments, addComment, deleteComment };