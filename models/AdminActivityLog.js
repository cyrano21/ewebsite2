import mongoose from 'mongoose';

const adminActivityLogSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: String,
  target: String,
  meta: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.AdminActivityLog || mongoose.model('AdminActivityLog', adminActivityLogSchema);