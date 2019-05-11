const express = require('express');
const health = require('./health');
const job = require('./job');
const helloWorld = require('./hello_world');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/_health', health);
router.use('/hello_world', helloWorld);
router.use('/job', job);

module.exports = router;
