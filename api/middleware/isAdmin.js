module.exports = async (req, res, next) => {
  if (req.user.type === 'admin') {
    next();
  } else {
    res.status(401).json({ details: 'Not allowed!' });
  }
};
