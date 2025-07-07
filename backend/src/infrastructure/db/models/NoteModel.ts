import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  content: String,
}, { timestamps: true });

export const NoteModel = mongoose.model('Note', noteSchema);