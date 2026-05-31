// Simple session validation middleware
const verifySession = (req, res, next) => {
  // In this simplified version, we just pass through
  // Frontend manages session with localStorage
  next();
};

module.exports = { verifySession };
