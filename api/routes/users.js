const express = require('express');
const router = express.Router();

const Joi = require('@hapi/joi');

const isAuthenticated = require('../middleware/isAuthenticated');
const isAllowed = require('../middleware/isAllowed');
const User = require('../models/User');

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
    logger.error(error);
    if (error.name === 'MongoError') {
      if (error.code === 11000) {
        return res.status(400).json({ details: `'${validatedRequestBody.email}' is already in use.` });
      }
    }
    res.status(500).json({ details: error });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await User.find({ type: 'regular' });
    res.json({
      users: users.map(user => user.toClient()),
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ details: error });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.json({
        user: user.toClient(),
      });
    } else {
      res.status(404).json({ details: `User ${req.params.id} is not found!` });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({ details: error.message || error });
  }
});

router.put('/:id', isAuthenticated, isAllowed, async (req, res) => {
  const requestSchema = Joi.object().keys({
    id: Joi.string(),
    email: Joi.string().email({ minDomainSegments: 2 }),
    firstName: Joi.string()
      .trim()
      .required(),
    lastName: Joi.string()
      .trim()
      .required(),
    city: Joi.string().trim(),
    country: Joi.string().trim(),
    category: Joi.string(),
    subCategories: Joi.array().items(Joi.string()),
  });
  const { error: validationError, value: validatedRequestBody } = Joi.validate(req.body, requestSchema);
  if (validationError) {
    return res.status(400).json({ details: validationError.details[0].message });
  }
  try {
    await User.findByIdAndUpdate(req.params.id, validatedRequestBody, { useFindAndModify: false });
    res.json({ status: 'updated' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ details: error });
  }
});

router.delete('/:id', isAuthenticated, isAllowed, async (req, res) => {
  try {
    await User.findByIdAndRemove(req.params.id, { useFindAndModify: false });
    res.json({ status: 'deleted' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ details: error });
  }
});

module.exports = router;
