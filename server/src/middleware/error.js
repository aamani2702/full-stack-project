const notFound = (req, res) => res.status(404).json({ message: `Route ${req.originalUrl} not found` });

// Central error handler: turns Mongoose / runtime errors into clean JSON
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(', ') });
  }
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid id.' });
  if (err.code === 11000) return res.status(409).json({ message: 'That email is already registered.' });
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
};

module.exports = { notFound, errorHandler };
