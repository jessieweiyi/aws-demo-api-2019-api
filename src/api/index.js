const express = require('express');
const health = require('./health');
const job = require('./job');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/_health', health);
router.use('/job', job);

module.exports = router;
