const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  key: { type: String, uppercase: true },
}, { timestamps: true });

projectSchema.pre('save', function() {
  if (this.isNew && this.title && !this.key) {
    this.key = this.title.slice(0, 3).toUpperCase();
  }
});

module.exports = mongoose.model('Project', projectSchema);
