const Requirement = require('../models/requirement');
const Attachment = require('../models/attachment'); // Your Attachment model

// Controller for retrieving all requirements
async function getAllRequirements(req, res) {
  try {
    const requirements = await Requirement.find();
    res.json(requirements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Controller for creating a new requirement
async function createRequirement(req, res) {
  try {
    console.log(JSON.stringify(req.body));

    const newRequirement = new Requirement(req.body);

    const reqCount = await Requirement.countDocuments();
    newRequirement.ID = `REQ_${(reqCount + 1).toString().padStart(3, '0')}`;

    // Handle multiple attachments (if provided)
    if (req.files && req.files.length > 0) {
      const attachments = req.files.map((file) => ({
        filename: file.originalname,
        contentType: file.mimetype,
        sourceModel: 'Requirement',
        sourceId: newRequirement.ID,
        data: file.buffer, // Store the file buffer in the attachment model
      }));

      // Save the attachments in the Attachment model
      const savedAttachments = await Attachment.insertMany(attachments);

      // Add the attachment IDs to the attachment field in the new requirement
      newRequirement.attachment = savedAttachments.map((attachment) => attachment._id);
    }

    // Ensure that testCase and testPlan are arrays of ObjectId
    newRequirement.testCase = Array.isArray(newRequirement.testCase)
      ? newRequirement.testCase.map((id) => ObjectId(id))
      : [];
    newRequirement.testPlan = Array.isArray(newRequirement.testPlan)
      ? newRequirement.testPlan.map((id) => ObjectId(id))
      : [];

    const savedRequirement = await newRequirement.save();
    res.status(201).json(savedRequirement);


  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Controller for updating a requirement
async function updateRequirement(req, res) {
  try {
    console.log(JSON.stringify(req.body));
    console.log(JSON.stringify(req.body.data));
    const requirementId = req.params.id;

    // Find the existing requirement by its ID
    const existingRequirement = await Requirement.findOne({ID: requirementId});
    if (!existingRequirement) {
      return res.status(404).json({ error: 'Requirement not found' });
    }

    // Get the update fields from the request body
    const {
      title,
      description,
      status,
      priority,
      type,
      dateUpdated,
      dependency,
      attachment,
      createdBy,
      testCase,
      testPlan,
    } = req.body;

    // Update only the provided fields and keep the previous value if the field is not present in the request body
    existingRequirement.title = title || existingRequirement.title;
    existingRequirement.description = description || existingRequirement.description;
    existingRequirement.status = status || existingRequirement.status;
    existingRequirement.priority = priority || existingRequirement.priority;
    existingRequirement.type = type || existingRequirement.type;
    existingRequirement.dateUpdated = new Date();
    existingRequirement.dependency = dependency || existingRequirement.dependency;
    existingRequirement.attachment = attachment || existingRequirement.attachment;
    existingRequirement.createdBy = createdBy || existingRequirement.createdBy;

    // If the testCase and testPlan are provided, they should be arrays of ObjectIds
    if (testCase && Array.isArray(testCase)) {
      existingRequirement.testCase = testCase;
    }
    if (testPlan && Array.isArray(testPlan)) {
      existingRequirement.testPlan = testPlan;
    }

     // Handle multiple attachments (if provided)
     if (req.files && req.files.length > 0) {
      const attachments = req.files.map((file) => ({
        filename: file.originalname,
        contentType: file.mimetype,
        sourceModel: 'Requirement',
        sourceId: requirementId,
        data: file.buffer, // Store the file buffer in the attachment model
      }));

      // Save the attachments in the Attachment model
      const savedAttachments = await Attachment.insertMany(attachments);

      // Add the attachment IDs to the attachment field in the existing requirement
      existingRequirement.attachment.push(...savedAttachments.map((attachment) => attachment._id));
    }

    // Save the updated requirement
    const updatedRequirement = await existingRequirement.save();

    res.json(updatedRequirement);
  } catch (error) {
    console.error(error); // Log the error object for detailed information
    res.status(400).json({ error: error.message });
  }
}

// Controller for retrieving a specific requirement
async function getRequirementById(req, res) {
  try {
    const requirement = await Requirement.findOne({ID: req.params.id});
    if (!requirement) {
      return res.status(404).json({ error: 'Requirement not found' });
    }
    // Fetch the attachments for this requirement using the attachment IDs
    const attachments = await Attachment.find({ _id: { $in: requirement.attachment } });

    // Create a new object with the requirement data and the fetched attachments
    const requirementWithAttachments = {
      ...requirement.toObject(),
      attachments: attachments.map((attachment) => ({
        _id: attachment._id,
        name: attachment.filename,
        type: attachment.contentType,
        data: attachment.data,
        base64data: attachment.data.toString('base64'),
        sourceId: attachment.sourceId,
        createdAt: attachment.createdAt,
        // Add any other attachment fields you want to include in the response
      })),
    };

    res.json(requirementWithAttachments);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Controller for deleting a requirement
async function deleteRequirement(req, res) {
  try {
    const requirementId = req.params.id;

    // Find the requirement by its ID
    const existingRequirement = await Requirement.findOne({ ID: requirementId });
    if (!existingRequirement) {
      return res.status(404).json({ error: 'Requirement not found' });
    }

    // Remove the attachments associated with the requirement from the Attachment model
    const attachmentIds = existingRequirement.attachment;
    if (attachmentIds && attachmentIds.length > 0) {
      await Attachment.deleteMany({ _id: { $in: attachmentIds } });
    }

    // Delete the requirement
    await Requirement.deleteOne({ ID: requirementId });

    res.json({ message: 'Requirement and associated attachments deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getAllRequirements,
  createRequirement,
  updateRequirement,
  getRequirementById,
  deleteRequirement,
};