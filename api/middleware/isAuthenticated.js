const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../configs/configs')();

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = await jwt.verify(token, config.keys.tokenKey);
    if (decoded) {
      req.user = await User.findById(decoded.uid);
      if (decoded.uid === req.params.id || req.user.type === 'admin') {
        return next();
      }
    }
    res.status(401).json({ details: 'Unauthorized request!' });
  } catch (e) {
    res.status(401).json({ details: 'Unauthorized request!' });
  }
};
