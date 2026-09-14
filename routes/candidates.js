const express = require('express');
const router = express.Router();
const candidatesController = require('../controllers/candidates');

router.get('/', candidatesController.getAll);
router.get('/:id', candidatesController.getSingle);
router.post('/', candidatesController.createCandidate);
router.put('/:id', candidatesController.updateCandidate);     // Added this
router.delete('/:id', candidatesController.deleteCandidate);  // Added this

module.exports = router;