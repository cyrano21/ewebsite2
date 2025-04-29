const mongoose = require('mongoose');

const ArticleCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  slug: { type: String, trim: true, unique: true },
  description: { type: String, trim: true }
}, { timestamps: true });

// Auto-generate slug from name if not provided
ArticleCategorySchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
  }
  next();
});

const ArticleCategory = mongoose.models.ArticleCategory || mongoose.model('ArticleCategory', ArticleCategorySchema);
module.exports = ArticleCategory;
