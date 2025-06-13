import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: {
    type: String,
    enum: ['ICEBOX', 'BACKLOG', 'ONGOING', 'REVIEW', 'DONE'],
    default: 'ICEBOX',
  },
  card: { type: mongoose.Schema.Types.ObjectId, ref: 'Card' },
  assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

export default Task;
