const express = require('express');
const router = express.Router();
const questionsController = require('../controllers/questions');

router.get('/', questionsController.getAll);
router.get('/:id', questionsController.getSingle);
router.post('/', questionsController.createQuestion);
router.put('/:id', questionsController.updateQuestion);     // Added this
router.delete('/:id', questionsController.deleteQuestion);  // Added this

module.exports = router;