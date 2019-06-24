const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/isAuthenticated');
const isAllowed = require('../middleware/isAllowed');

const Joi = require('@hapi/joi');
const moment = require('moment');

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

    const message = new Message({ ...validatedRequestBody, timestamp: moment().valueOf() });
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
      messages: messages.map(m => m.toClient()),
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ details: error });
  }
});

router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ details: 'Message not found!' });
    }

    if (String(message.uid) !== String(req.user.id)) {
      return res.status(405).json({ details: 'Not allowed!' });
    }
    await Message.findByIdAndRemove(req.params.id, { useFindAndModify: false });

    res.json({
      status: 'deleted',
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ details: error });
  }
});

module.exports = router;
