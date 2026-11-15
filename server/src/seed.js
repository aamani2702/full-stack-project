const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const Post = require('./models/Post');

const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70`;

const products = [
  ['Monstera Deliciosa', 'The iconic split-leaf beauty. Thrives in bright, indirect light and brings instant jungle energy.', 34, 'Indoor', 'photo-1614594975525-e45190c55d0b', 4.9],
  ['Snake Plant', 'Nearly indestructible and an excellent air purifier. Perfect for beginners and low-light corners.', 22, 'Indoor', 'photo-1593482892290-f54927ae1bb6', 4.8],
  ['Fiddle Leaf Fig', 'A statement tree with glossy, violin-shaped leaves. Loves a sunny spot and steady care.', 58, 'Indoor', 'photo-1545239705-1564e58b9e4a', 4.5],
  ['Golden Pothos', 'Trailing vines that grow almost anywhere. Great for shelves and hanging baskets.', 18, 'Indoor', 'photo-1572688484438-313a6e50c333', 4.7],
  ['Echeveria Rosette', 'A sculptural rosette succulent in soft sage tones. Needs sun and very little water.', 12, 'Succulent', 'photo-1509423350716-97f9360b4e09', 4.6],
  ['Aloe Vera', 'Soothing, easy and useful. Keep it sunny and let the soil dry between waterings.', 15, 'Succulent', 'photo-1596547609652-9cf5d8d76921', 4.8],
  ['Jade Plant', 'A symbol of good luck with thick, glossy leaves. Lives for decades with minimal fuss.', 20, 'Succulent', 'photo-1512428813834-c702c7702b78', 4.4],
  ['Peace Lily', 'Elegant white blooms and dark green foliage. Tells you when it is thirsty by drooping.', 28, 'Flowering', 'photo-1593691509543-c55fb32d8de5', 4.6],
  ['Phalaenopsis Orchid', 'Long-lasting, graceful blooms in pure white. A timeless gift.', 42, 'Flowering', 'photo-1566836610593-62a64888a216', 4.7],
  ['African Violet', 'Compact and cheerful with velvety leaves and year-round purple flowers.', 14, 'Flowering', 'photo-1599009434818-1b8dc4a4ba55', 4.3],
  ['Sweet Basil', 'Fragrant, fast-growing and ready for your kitchen windowsill pesto.', 8, 'Herb', 'photo-1618375569909-3c8616cf7733', 4.5],
  ['Rosemary', 'Woody, aromatic and drought tolerant. A kitchen garden staple.', 10, 'Herb', 'photo-1515586000433-45406d8e6662', 4.6],
  ['Terracotta Pot Set', 'Set of three hand-finished terracotta pots with drainage saucers.', 26, 'Accessory', 'photo-1485955900006-10f4d324d411', 4.8],
  ['Brass Mister', 'A refined brass spray bottle that keeps humidity-loving plants happy.', 19, 'Accessory', 'photo-1416879595882-3373a0480b5b', 4.4],
].map(([name, description, price, category, photo, rating], i) => ({
  name, description, price, category, rating, image: img(photo), stock: 6 + ((i * 7) % 25),
}));

async function run({ reset = false } = {}) {
  if (reset) await Promise.all([User.deleteMany(), Product.deleteMany(), Post.deleteMany()]);

  const [adminHash, userHash] = await Promise.all([bcrypt.hash('Admin@123', 12), bcrypt.hash('Demo@1234', 12)]);
  const admin = await User.create({ name: 'Bloom Admin', email: 'admin@bloom.com', password: adminHash, role: 'admin' });
  const demo = await User.create({ name: 'Demo Gardener', email: 'demo@bloom.com', password: userHash });
  await Product.insertMany(products);
  await Post.insertMany([
    { title: '5 Plants That Survive Almost Anything', body: 'New to plants? Start with a snake plant, pothos, jade, aloe and a ZZ plant. They forgive missed waterings and low light, and they will reward you with steady growth all year.', author: admin._id },
    { title: 'How I Finally Stopped Overwatering', body: 'The finger test changed everything: push a finger two inches into the soil. If it feels damp, wait. Most houseplants prefer a thorough drink followed by a dry spell over constant moisture.', author: demo._id },
    { title: 'Light 101: Reading Your Windows', body: 'North windows give gentle, low light. East windows give soft morning sun. South and west windows are the brightest. Match your plant to the window and half the battle is won.', author: admin._id },
  ]);
  console.log('Seeded demo data: admin@bloom.com / Admin@123  |  demo@bloom.com / Demo@1234');
}

module.exports = { run };

// `npm run seed` against a real database
if (require.main === module) {
  require('dotenv').config();
  if (!process.env.MONGODB_URI) {
    console.error('Set MONGODB_URI in .env before running the seed script.');
    process.exit(1);
  }
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => run({ reset: true }))
    .then(() => process.exit(0));
}
