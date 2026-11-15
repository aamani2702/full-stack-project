const router = require('express').Router();
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');

// READ (public)
router.get('/', async (req, res) => {
  res.json(await Post.find().populate('author', 'name').sort({ createdAt: -1 }));
});

// CREATE (logged-in users)
router.post('/', protect, async (req, res) => {
  const { title, body } = req.body;
  const post = await Post.create({ title, body, author: req.user._id });
  res.status(201).json(await post.populate('author', 'name'));
});

// Only the author (or an admin) may edit / delete
async function loadOwned(req, res, next) {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found.' });
  const owner = post.author.equals(req.user._id) || req.user.role === 'admin';
  if (!owner) return res.status(403).json({ message: 'You can only change your own posts.' });
  req.post = post;
  next();
}

router.put('/:id', protect, loadOwned, async (req, res) => {
  req.post.title = req.body.title ?? req.post.title;
  req.post.body = req.body.body ?? req.post.body;
  await req.post.save();
  res.json(await req.post.populate('author', 'name'));
});

router.delete('/:id', protect, loadOwned, async (req, res) => {
  await req.post.deleteOne();
  res.json({ message: 'Post deleted.' });
});

module.exports = router;
