// Import the required dependencies and models
const Application = require('../models/application');
const Requirement = require('../models/requirement');
const TestCase = require('../models/testCase');
const Attachment = require('../models/attachment');

async function isTestCaseLinked(testCaseId) {
  try {
    // Check if the test case ID is linked to any application
    const linkedToApplications = await Application.exists({ testCase: testCaseId });

    // Check if the test case ID is linked to any requirement
    const linkedToRequirements = await Requirement.exists({ testCase: testCaseId });

    return linkedToApplications || linkedToRequirements;
  } catch (error) {
    console.error(error);
    return true; // To be cautious, assume it's linked if there's an error
  }
}

async function deleteTestCase(req, res) {
  try {
    const testCaseId = req.params.id;

    // Check if the test case is linked to any application or requirement
    const isLinked = await isTestCaseLinked(testCaseId);
    if (isLinked) {
      return res.status(400).json({ error: 'Cannot delete test case. It is linked to an application or requirement.' });
    }

    // If the test case is not linked, proceed with deletion
    const deletedTestCase = await TestCase.findOneAndDelete({ ID: testCaseId });
    if (!deletedTestCase) {
      return res.status(404).json({ error: 'Test case not found.' });
    }

    res.status(200).json({ message: 'Test case deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete test case.' });
  }
}

// Controller for creating a new test case
async function createTestCase(req, res) {
  try {
    const {
      name,
      description,
      testSteps,
      expectedResults,
      priority,
      type,
      status,
      dateCreated,
      dateUpdated,
      requirement,
      attachment,
      testEnvironment,
      testPlan,
      createdBy,
      testResult
    } = req.body;

    // Set default values for non-required fields if not provided in the request
    const defaultTestEnvironment = 'Staging';
    const defaultCreatedBy = null;
    const defaultTestResult = null;

    // Check for required fields
    if (
      !name ||
      !description ||
      !testSteps ||
      !expectedResults ||
      !priority ||
      !type ||
      !status ||
      !dateCreated ||
      !dateUpdated ||
      !requirement ||
      !testPlan
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create a new test case using the provided and default values
    const newTestCase = new TestCase({
      name,
      description,
      testSteps,
      expectedResults,
      priority,
      type,
      status,
      dateCreated,
      dateUpdated,
      requirement,
      attachment,
      testEnvironment: testEnvironment || defaultTestEnvironment,
      testPlan,
      createdBy: createdBy || defaultCreatedBy,
      testResult: testResult || defaultTestResult
    });

    // Save the new test case to the database
    const savedTestCase = await newTestCase.save();
    res.status(201).json(savedTestCase);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Invalid data' });
  }
}

// Controller for updating a test case
async function updateTestCase(req, res) {
  try {
    const testCaseId = req.params.id;
    const updatedFields = {};

    // Check each field in the request body and add it to updatedFields if it exists
    if (req.body.name) updatedFields.name = req.body.name;
    if (req.body.description) updatedFields.description = req.body.description;
    if (req.body.testSteps) updatedFields.testSteps = req.body.testSteps;
    if (req.body.expectedResults) updatedFields.expectedResults = req.body.expectedResults;
    if (req.body.priority) updatedFields.priority = req.body.priority;
    if (req.body.type) updatedFields.type = req.body.type;
    if (req.body.status) updatedFields.status = req.body.status;
    if (req.body.dateUpdated) updatedFields.dateUpdated = req.body.dateUpdated;
    if (req.body.requirement) updatedFields.requirement = req.body.requirement;
    if (req.body.attachment) updatedFields.attachment = req.body.attachment;
    if (req.body.testEnvironment) updatedFields.testEnvironment = req.body.testEnvironment;
    if (req.body.testPlan) updatedFields.testPlan = req.body.testPlan;
    if (req.body.createdBy) updatedFields.createdBy = req.body.createdBy;
    if (req.body.testResult) updatedFields.testResult = req.body.testResult;

    // Find the existing test case document by ID
    const existingTestCase = await TestCase.findById(testCaseId);
    if (!existingTestCase) {
      return res.status(404).json({ error: 'Test case not found' });
    }

    // Combine the updatedFields with the existing test case to preserve the previous values
    const updatedTestCase = Object.assign(existingTestCase, updatedFields);

    // Save the updated test case to the database
    const savedTestCase = await updatedTestCase.save();

    // Send the updated test case as the response
    res.json(savedTestCase);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Invalid data' });
  }
}

// Controller for getting all test cases
async function getAllTestCases(req, res) {
  try {
    const testCases = await TestCase.find();
    res.json(testCases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

// Controller for getting all test cases
async function getTestCaseByID(req, res) {
  const id = req.params.id;
  try {
    const testCase = await TestCase.find({ ID: id});
    res.json(testCase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}


// Controller for getting all test cases
async function getTestCaseById(req, res) {
  const id = req.params.id;
  try {
    const testCase = await TestCase.findById(id);
    res.json(testCase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createTestCase,
  updateTestCase,
  getAllTestCases,
  getTestCaseByID,
  getTestCaseById,
  deleteTestCase,
};