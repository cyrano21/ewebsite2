import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: String,
  description: String,
  icon: String
});

export default mongoose.models.Category || mongoose.model('Category', categorySchema);