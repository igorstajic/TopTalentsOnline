const express = require('express');
const router = express.Router();

const Joi = require('@hapi/joi');

const isAuthenticated = require('../middleware/isAuthenticated');
const isAllowed = require('../middleware/isAllowed');
const User = require('../models/User');

//POST /users/register
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

//GET /users
router.get('/', async (req, res) => {
  try {
    const querySchema = Joi.object().keys({
      filter: Joi.string()
        .allow('')
        .default(''),
      categories: Joi.string()
        .allow('')
        .default(''),
      subCategories: Joi.string()
        .allow('')
        .default(''),
      limit: Joi.number()
        .integer()
        .min(1)
        .default(10),
      page: Joi.number()
        .integer()
        .min(1)
        .default(1),
    });
    const { error: validationError, value: requestQuery } = Joi.validate(req.query, querySchema);
    if (validationError) {
      return res.status(400).json({ details: validationError.details[0].message });
    }
    const filters = [
      { firstName: new RegExp(requestQuery.filter, 'gi') },
      { lastName: new RegExp(requestQuery.filter, 'gi') },
      { city: new RegExp(requestQuery.filter, 'gi') },
      { country: new RegExp(requestQuery.filter, 'gi') },
    ];

    const categoryFilters = {};
    if (requestQuery.categories) {
      categoryFilters.category = { $in: requestQuery.categories.split(',') };
    }
    if (requestQuery.subCategories) {
      categoryFilters.subCategories = { $all: requestQuery.subCategories.split(',') };
    }
    if (requestQuery.filter && requestQuery.filter.split(' ').length) {
      filters.push({
        $and: [
          { firstName: new RegExp(requestQuery.filter.split(' ')[0], 'gi') },
          { lastName: new RegExp(requestQuery.filter.split(' ')[1], 'gi') },
        ],
      });
    }
    const usersQuery = User.where({ type: 'regular' })
      .and(categoryFilters)
      .or(filters);
    const count = await usersQuery.countDocuments();
    const users = await usersQuery
      .find()
      .skip(requestQuery.limit * (requestQuery.page - 1))
      .limit(requestQuery.limit);
    res.json({
      users: users.map(user => user.toClient()),
      hasMore: count - users.length - (requestQuery.page - 1) * requestQuery.limit > 0,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ details: error });
  }
});

//GET /users/:id
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

//PUT /users/:id
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
    city: Joi.string().trim().allow(''),
    country: Joi.string().trim().allow(''),
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

//DELETE /users/:id
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
