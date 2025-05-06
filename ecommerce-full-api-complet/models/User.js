import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  label: String,
  street: String,
  city: String,
  postalCode: String,
  country: String,
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  avatar: String,
  addresses: [addressSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', userSchema);