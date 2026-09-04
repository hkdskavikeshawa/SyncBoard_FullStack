import mongoose from 'mongoose';

const columnSchema = new mongoose.Schema({
  name: { type: String, required: true },
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  order: { type: Number, required: true }
}, { timestamps: true });

columnSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Column = mongoose.model('Column', columnSchema);
export default Column;
