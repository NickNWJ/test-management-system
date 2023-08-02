const express = require('express');
const testCaseController = require('../controllers/testCaseController');

const router = express.Router();

// Routes for test cases
router.post('/create', testCaseController.createTestCase);

router.get('/all', testCaseController.getAllTestCases);

router.get('/test-case/ID/:id', testCaseController.getTestCaseByID);

router.get('/test-case/Id/:id', testCaseController.getTestCaseById);

router.get('/test-case/update/:id', testCaseController.updateTestCase);

router.delete('/test-case/delete/:id', testCaseController.deleteTestCase);

module.exports = router;