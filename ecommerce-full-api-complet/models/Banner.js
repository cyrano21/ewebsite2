import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: String,
  image: String,
  link: String,
  position: { type: String, enum: ['top', 'middle', 'footer'] }
});

export default mongoose.models.Banner || mongoose.model('Banner', bannerSchema);