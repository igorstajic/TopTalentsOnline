const express = require('express');
const router = express.Router();

const Joi = require('@hapi/joi');
const _ = require('lodash');

const User = require('../models/User');
const isAuthenticated = require('../middleware/isAuthenticated');
const isAllowed = require('../middleware/isAllowed');

router.post('/register', async (req, res) => {
  const requestSchema = Joi.object().keys({
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
    // city: Joi.string()
    //   .trim()
    //   .required(),
    // country: Joi.string()
    //   .trim()
    //   .required(),
  });
  const { error: validationError, value: validatedRequestBody } = Joi.validate(req.body, requestSchema);
  if (validationError) {
    return res.status(400).json({ details: validationError.details[0].message });
  }

  try {
    const newUser = new User({ ...validatedRequestBody, type: 'regular' });
    const response = await newUser.save();
    res.json({ user: { id: response.id } });
  } catch (error) {
    console.error(error); //eslint-disable-line
    if (error.name === 'MongoError') {
      if (error.code === 11000) {
        return res.status(400).json({ details: `'${validatedRequestBody.email}' is already in use.` });
      }
    }
    res.status(500).json({ details: error });
  }
});

// Get all profiles.
router.get('/', async (req, res) => {
  try {
    const users = await User.find({ type: 'regular' });
    res.json({ users: users.map(user => _.pick(user, ['id', 'email', 'firstName', 'lastName', 'city', 'country'])) });
  } catch (error) {
    console.error(error); //eslint-disable-line
    res.status(500).json({ details: error });
  }
});

// Get profile by id.
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.json({ user: _.pick(user, ['id', 'email', 'firstName', 'lastName', 'city', 'country']) });
    } else {
      res.status(404).json({ details: `User ${req.params.id} is not found!` });
    }
  } catch (error) {
    console.error(error); //eslint-disable-line
    res.status(500).json({ details: error });
  }
});

// Update profile data by id.
router.put('/:id', isAuthenticated, isAllowed, async (req, res) => {
  const requestSchema = Joi.object().keys({
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
  const { error: validationError, value: validatedRequestBody } = Joi.validate(req.body, requestSchema);
  if (validationError) {
    return res.status(400).json({ details: validationError.details[0].message });
  }
  try {
    await User.findByIdAndUpdate(req.params.id, _.omit(validatedRequestBody, ['password']), { useFindAndModify: false });
    res.json({ status: 'updated' });
  } catch (error) {
    console.error(error); //eslint-disable-line
    res.status(500).json({ details: error });
  }
});

// Remove profile by id.
router.delete('/:id', isAuthenticated, isAllowed, async (req, res) => {
  try {
    await User.findByIdAndRemove(req.params.id, { useFindAndModify: false });
    res.json({ status: 'deleted' });
  } catch (error) {
    console.error(error); //eslint-disable-line
    res.status(500).json({ details: error });
  }
});

module.exports = router;
