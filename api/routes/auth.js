const express = require('express');
const Joi = require('@hapi/joi');
const _ = require('lodash');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const config = require('../configs/configs')();
const isAuthenticated = require('../middleware/isAuthenticated');
const isAdmin = require('../middleware/isAdmin');

router.post('/login', async function(req, res) {
  const schema = Joi.object().keys({
    password: Joi.string()
      .trim()
      .required(),
    email: Joi.string().email({ minDomainSegments: 2 }),
  });

  const { error: validationError, value: data } = Joi.validate(req.body, schema);

  if (validationError) {
    return res.status(400).json({ details: validationError.details[0].message });
  }

  try {
    const user = await User.findOne({ email: data.email }).exec();
    if (!user) {
      return res.status(401).json({ details: 'Invalid username and password combination!' });
    }
    const isMatching = await user.comparePassword(data.password);
    if (isMatching) {
      let token = jwt.sign({ uid: user.id }, config.keys.tokenKey, { expiresIn: config.keys.tokenExpiresIn });
      res.json({ user: _.pick(user, ['email', 'firstName', 'lastName', 'id', 'type']), token });
    } else {
      res.status(401).json({ details: 'Invalid username and password combination!' });
    }
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ details: error });
  }
});

router.post('/change-password', isAuthenticated, async (req, res) => {
  const requestSchema = Joi.object().keys({
    oldPassword: Joi.string()
      .trim()
      .required(),
    newPassword: Joi.string()
      .trim()
      .required(),
  });
  const { error: validationError, value: validatedRequestBody } = Joi.validate(req.body, requestSchema);
  if (validationError) {
    return res.status(400).json({ details: validationError.details[0].message });
  }
  try {
    const isMatching = await req.user.comparePassword(validatedRequestBody.oldPassword);

    if (isMatching) {
      req.user.password = validatedRequestBody.newPassword;
      await req.user.save();
      res.json({ status: 'Pasword updated.' });
    } else {
      res.status(500).json({ details: 'Old password is invalid!' });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({ details: error });
  }
});

router.post('/admin/change-user-password/:id', isAuthenticated, isAdmin, async (req, res) => {
  const requestSchema = Joi.object().keys({
    oldPassword: Joi.string()
      .trim()
      .required(),
    newPassword: Joi.string()
      .trim()
      .required(),
  });
  const { error: validationError, value: validatedRequestBody } = Joi.validate(req.body, requestSchema);
  if (validationError) {
    return res.status(400).json({ details: validationError.details[0].message });
  }
  try {
    const targetUser = await User.findById(req.params.id);
    const isMatching = await targetUser.comparePassword(validatedRequestBody.oldPassword);

    if (isMatching) {
      targetUser.password = validatedRequestBody.newPassword;
      await targetUser.save();
      res.json({ status: 'Pasword updated.' });
    } else {
      res.status(500).json({ details: 'Old password is invalid!' });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({ details: error });
  }
});

router.get('/check-user-token', isAuthenticated, (req, res) =>
  res.json({ user: _.pick(req.user, ['id', 'email', 'firstName', 'lastName', 'type']) })
);

module.exports = router;
