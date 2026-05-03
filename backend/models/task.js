const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  project: {
    type: String,
    required: true,
    default: 'General'
  },
  deadline: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    required: true,
    enum: ['To-Do', 'Done'], 
    default: 'To-Do' 
  },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);