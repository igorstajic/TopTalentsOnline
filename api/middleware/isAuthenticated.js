const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../configs/configs')();

module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ details: 'Missing authorization header!' });
    }
    const token = req.headers.authorization.split(' ')[1];
    const decoded = await jwt.verify(token, config.keys.tokenKey);
    if (decoded) {
      req.user = await User.findById(decoded.uid);
      if (req.user) {
        return next();
      }
    }
    res.status(401).json({ details: 'Unauthorized request!' });
  } catch (e) {
    // console.error(e);
    res.status(401).json({ details: 'Unauthorized request!' });
  }
};
