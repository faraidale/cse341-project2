const express = require('express');
const router = express.Router();
const candidatesController = require('../controllers/candidates');
const ensureAuthenticated = require('../middleware/ensure-authenticated');

router.get('/', candidatesController.getAll);
router.get('/:id', candidatesController.getSingle);
router.post('/', ensureAuthenticated, candidatesController.createCandidate);
router.put('/:id', ensureAuthenticated, candidatesController.updateCandidate);
router.delete('/:id', ensureAuthenticated, candidatesController.deleteCandidate);

module.exports = router;