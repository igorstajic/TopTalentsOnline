const express = require('express');
const router = express.Router();

const User = require('../models/User');

router.get('/all', async (req, res) => {
  try {
    const allUsedCategories = await User.distinct('category');
    const allUsedSubCategories = await User.distinct('subCategories');

    res.json({
      categories: allUsedCategories,
      subCategories: allUsedSubCategories
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ details: error });
  }
});

module.exports = router;
