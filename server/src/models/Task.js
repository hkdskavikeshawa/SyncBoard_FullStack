import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  columnId: { type: mongoose.Schema.Types.ObjectId, ref: 'Column', required: true },
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  assigneeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dueDate: { type: String },
  priority: { type: String, default: 'medium', enum: ['low', 'medium', 'high', 'urgent'] }
}, { timestamps: true });

taskSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Task = mongoose.model('Task', taskSchema);
export default Task;
