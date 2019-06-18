const express = require('express');
const router = express.Router();

const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const db = require('../configs/db');
const User = require('../models/User');
const isAuthenticated = require('../middleware/isAuthenticated');

router.post('/register', async (req, res, next) => {
  const schema = Joi.object().keys({
    password: Joi.string()
      .trim()
      .required(),
    email: Joi.string().email({ minDomainSegments: 2 }),
    firstName: Joi.string()
      .trim()
      .required(),
    lastName: Joi.string()
      .trim()
      .required(),
    city: Joi.string()
      .trim()
      .required(),
    country: Joi.string()
      .trim()
      .required(),
  });

  const { error: validationError, value: validatedRequestBody } = Joi.validate(req.body, schema);
  if (validationError) {
    return res.status(400).json({ details: validationError.details });
  }

  try {
    const newUser = new User({ ...validatedRequestBody, type: 'regular' });
    const response = await newUser.save();
    res.json({ user: { id: response.id } });
  } catch (error) {
    console.error(error);
    if (error.name === 'MongoError') {
      if (error.code === 11000) {
        return res.status(400).json({ details: `'${validatedRequestBody.email}' is already in use.` });
      }
    }
    res.status(500).json({ details: error });
  }
});

router.get('/', async (req, res, next) => {
  const users = await User.find({ type: 'regular' });
  res.json({ users: users.map(user => _.pick(user, ['id', 'email', 'firstName', 'lastName', 'city', 'country'])) });
});
router.put('/:id', isAuthenticated, async (req, res, next) => {
  res.json({ user: req.user });
});

router.delete('/:id', isAuthenticated, async (req, res, next) => {
  res.json({ user: req.user });
});

module.exports = router;
