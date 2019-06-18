module.exports = async (req, res, next) => {
  if (req.user.id === req.params.id || req.user.type === 'admin') {
    next();
  } else {
    res.status(401).json({ details: 'Not allowed!' });
  }
};
