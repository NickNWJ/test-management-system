const express = require('express');
const testRunController = require('../controllers/testRunController');

const router = express.Router();

router.post('/create', testRunController.createTestRun);
router.put('/update/:id', testRunController.updateTestRun);
router.get('/all', testRunController.getAllTestRuns);

module.exports = router;