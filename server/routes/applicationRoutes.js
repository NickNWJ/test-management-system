const express = require('express');
const applicationController = require('../controllers/applicationController');
const requirementController = require('../controllers/requirementController');

const router = express.Router();

// Routes for applications
router.get('/all', applicationController.getAllApplications);
router.get('/applications/:id', applicationController.getApplicationById);
router.get('/application/:id', applicationController.getApplicationByDesignedId);
router.post('/create', applicationController.createApplication);
router.post('/update/:id', applicationController.updateApplication);
router.post('/delete/:id', applicationController.deleteApplication);

// Add other routes for updating, deleting, or performing other operations on applications if needed

module.exports = router;