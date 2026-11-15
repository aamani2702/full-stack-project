const router = require('express').Router();
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// READ (public): list with search, category filter, sort
router.get('/', async (req, res) => {
  const { q, category, sort } = req.query;
  const filter = {};
  if (category && category !== 'All') filter.category = String(category);
  if (q) filter.name = { $regex: escapeRegex(q), $options: 'i' };
  const sorts = { priceAsc: { price: 1 }, priceDesc: { price: -1 }, rating: { rating: -1 }, newest: { createdAt: -1 } };
  res.json(await Product.find(filter).sort(sorts[sort] || { createdAt: -1 }));
});

router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  res.json(product);
});

// CREATE / UPDATE / DELETE (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  res.status(201).json(await Product.create(req.body));
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  res.json(product);
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  res.json({ message: 'Product deleted.' });
});

module.exports = router;
