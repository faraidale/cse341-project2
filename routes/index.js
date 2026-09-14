const express = require('express');
const router = express.Router();

router.use('/candidates', require('./candidates'));
router.use('/questions', require('./questions')); // Just added this line!

module.exports = router;