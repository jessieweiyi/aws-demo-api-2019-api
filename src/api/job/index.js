import submitJob from './submitJob';
import queryJob from './queryJob';

const express = require('express');

const router = express.Router();

router.put('/:fileName', submitJob);
router.get('/:jobId', queryJob);

module.exports = router;
