const express = require('express');
const testPlanController = require('../controllers/testPlanController');
// File upload middleware
const upload = require('../middlewares/upload');
const router = express.Router();

// Routes for test plans
router.get('/all', testPlanController.getAllTestPlans);
router.get('/test-plan/:id', testPlanController.getTestPlanById);
router.post('/create', upload.array('attachment'), testPlanController.createTestPlan);
router.post('/update/:id', upload.array('attachment'), testPlanController.updateTestPlanById);
router.delete('/delete/:id', testPlanController.deleteTestPlanById);

// Add other routes for updating, deleting, or performing other operations on test plans if needed

module.exports = router;