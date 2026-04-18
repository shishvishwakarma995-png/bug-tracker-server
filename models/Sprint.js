const mongoose = require('mongoose');

const sprintSchema = new mongoose.Schema({
  name: { type: String, required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  status: { type: String, enum: ['planning', 'active', 'completed'], default: 'planning' },
  goal: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Sprint', sprintSchema);