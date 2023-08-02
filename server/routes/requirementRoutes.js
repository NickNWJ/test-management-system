const express = require('express');
const requirementController = require('../controllers/requirementController');
// File upload middleware
const upload = require('../middlewares/upload'); 
const router = express.Router();

// Routes for requirements
router.get('/all', requirementController.getAllRequirements);
router.get('/requirement/:id', requirementController.getRequirementById);
router.post('/create', upload.array('attachment'), requirementController.createRequirement);
router.post('/update/:id', upload.array('attachment'), requirementController.updateRequirement);
router.delete('/delete/:id', requirementController.deleteRequirement);

// Add other routes for updating, deleting, or performing other operations on requirements if needed

module.exports = router;