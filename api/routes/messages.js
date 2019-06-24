const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/isAuthenticated');
const isAllowed = require('../middleware/isAllowed');

const Joi = require('@hapi/joi');

const Message = require('../models/Message');
const User = require('../models/User');

const sendEmail = require('../configs/mailer');

router.post('/send', async (req, res) => {
  try {
    const requestSchema = Joi.object().keys({
      uid: Joi.string().required(),
      from: Joi.string().email({ minDomainSegments: 2 }),
      contactName: Joi.string()
        .trim()
        .required(),
      message: Joi.string()
        .trim()
        .required(),
    });

    const { error: validationError, value: validatedRequestBody } = Joi.validate(req.body, requestSchema);
    if (validationError) {
      return res.status(400).json({ details: validationError.details[0].message });
    }
    const targetUser = await User.findById(validatedRequestBody.uid);
    await sendEmail({
      from: validatedRequestBody.email,
      to: targetUser.email,
      subject: 'You have been contacted on TopTalents!',
      text: validatedRequestBody.message,
    });

    const message = new Message(validatedRequestBody);
    message.save();
    res.json({ status: 'sent' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ details: error });
  }
});

router.get('/for-user/:id', isAuthenticated, isAllowed, async (req, res) => {
  try {
    const messages = await Message.find({ uid: req.params.id });
    res.json({
      messages,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ details: error });
  }
});

module.exports = router;
