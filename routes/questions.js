const express = require('express');
const router = express.Router();
const questionsController = require('../controllers/questions');
const ensureAuthenticated = require('../middleware/ensure-authenticated');

router.get('/', questionsController.getAll);
router.get('/:id', questionsController.getSingle);
router.post('/', ensureAuthenticated, questionsController.createQuestion);
router.put('/:id', ensureAuthenticated, questionsController.updateQuestion);
router.delete('/:id', ensureAuthenticated, questionsController.deleteQuestion);

module.exports = router;