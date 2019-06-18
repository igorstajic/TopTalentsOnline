const express = require('express');
const Joi = require('@hapi/joi');
const _ = require('lodash');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const config = require('../configs/configs')();

router.post('/login', async function(req, res, next) {
  const schema = Joi.object().keys({
    password: Joi.string()
      .trim()
      .required(),
    email: Joi.string().email({ minDomainSegments: 2 }),
  });

  const { error: validationError, value: data } = Joi.validate(req.body, schema);

  if (validationError) {
    return res.status(400).json({ details: validationError.details });
  }

  try {
    const user = await User.findOne({ email: data.email }).exec();
    const isMatching = await user.comparePassword(data.password);
    if (isMatching) {
      let token = jwt.sign({ uid: user.id }, config.keys.tokenKey, { expiresIn: '24h' });
      res.json({ user: _.pick(user, ['email', 'firstName', 'lastName', 'id']), token });
    } else {
      res.status(401).json({ details: 'Invalid username and password combination!' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ details: error });
  }
});

module.exports = router;
