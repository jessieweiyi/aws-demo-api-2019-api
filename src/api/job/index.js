import submitJob from './submitJob';

const express = require('express');

const router = express.Router();

router.put('/:fileName', submitJob);

module.exports = router;
