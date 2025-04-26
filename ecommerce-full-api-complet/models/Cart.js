import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  size: String,
  color: String,
  quantity: Number,
  price: Number
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [cartItemSchema],
  total: Number,
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Cart || mongoose.model('Cart', cartSchema);