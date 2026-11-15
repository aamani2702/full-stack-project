const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, required: true, maxlength: 600 },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, enum: ['Indoor', 'Succulent', 'Flowering', 'Herb', 'Accessory'] },
    image: { type: String, default: '' },
    stock: { type: Number, default: 10, min: 0 },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
