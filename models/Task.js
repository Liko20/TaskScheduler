const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    dueDate: Date,
    status: { type: String, enum: ['complete', 'incomplete'], default: 'incomplete' },
    dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    recurring: { type: String, enum: ['none', 'daily', 'weekly', 'monthly'], default: 'none' }
  });
  
  module.exports = mongoose.model('Task', taskSchema);