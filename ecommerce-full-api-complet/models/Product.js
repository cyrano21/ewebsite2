import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  price: Number,
  discount: Number,
  images: [String],
  sizes: [String],
  colors: [String],
  inStock: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  brand: String,
  ratings: Number,
  totalSold: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Product || mongoose.model('Product', productSchema);