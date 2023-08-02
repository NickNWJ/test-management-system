const Application = require('../models/application');
const TestPlan = require('../models/testPlan');
const TestCase = require('../models/testCase');
const TestRun = require('../models/testRun');
const TestResult = require('../models/testResult');
const Defect = require('../models/defect');
const User = require('../models/user');

// Function to generate a unique application ID
async function generateUniqueAppId() {
  const prefix = 'APP_';
  let incrementedValue = 1;

  while (true) {
    const incrementedId = prefix + incrementedValue.toString().padStart(3, '0');
    const existingApplication = await Application.findOne({ ID: incrementedId });

    if (!existingApplication) {
      return incrementedId;
    }

    incrementedValue++;
  }
}


// Controller for retrieving all applications
async function getAllApplications(req, res) {
  try {
    const applications = await Application.find();
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Controller for creating a new application
async function createApplication(req, res) {
  try {
    const { name, description, applicationUrl, platform, status, startDate, 
      requirement, user  } = req.body;
    console.log(JSON.stringify(req.body));
    if (!name || !description || !applicationUrl || !platform || !status || !startDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newApplication = new Application({
      name,
      description,
      applicationUrl,
      platform,
      status,
      startDate,
      user: (user && user.map) !== undefined ? user.map(us => us.toString()) : [],
      requirement: ( requirement && requirement.map) !== undefined && requirement.map(req => req.toString()), // Convert requirement array elements to strings
    });

    console.log("req" + requirement.length);

    // Generate a unique application ID
    newApplication.ID = await generateUniqueAppId();
    console.log("ID" +newApplication.ID);
    const savedApplication = await newApplication.save();
    res.status(201).json(savedApplication);
  } catch (error) {
    console.error(error); // Log the error object for detailed information
    res.status(400).json({ error: error.message });
  }
}

// Controller for updating an application
async function updateApplication(req, res) {
  try {
    const applicationId = req.params.id;

    // Find the existing application by its ID
    const existingApplication = await Application.findOne({ID: applicationId});
    if (!existingApplication) {
      return res.status(404).json({ error: 'Application not found' });
    }
    console.log(JSON.stringify(existingApplication));

    // Get the update fields from the request body
    const {
      name,
      description,
      applicationUrl,
      platform,
      status,
      startDate,
      requirement,
      user,
    } = req.body;

    // Update only the provided fields and keep the previous value if the field is not present in the request body
    existingApplication.name = name || existingApplication.name;
    existingApplication.description = description || existingApplication.description;
    existingApplication.applicationUrl = applicationUrl || existingApplication.applicationUrl;
    existingApplication.platform = platform || existingApplication.platform;
    existingApplication.status = status || existingApplication.status;
    existingApplication.startDate = startDate || existingApplication.startDate;
    existingApplication.user =
      user && user.map ? user.map((us) => us.toString()) : existingApplication.user;
    existingApplication.requirement =
      requirement && requirement.map
        ? requirement.map((req) => req.toString())
        : existingApplication.requirement;

    // Save the updated application
    const updatedApplication = await existingApplication.save();

    res.json(updatedApplication);
  } catch (error) {
    console.error(error); // Log the error object for detailed information
    res.status(400).json({ error: error.message });
  }
}

// Controller for retrieving a specific application
async function getApplicationById(req, res) {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Controller for retrieving a specific application
async function getApplicationByDesignedId(req, res) {
  try {
    const application = await Application.find({ID: req.params.id});
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}


async function deleteApplication(req, res) {
  try {
    const applicationId = req.params.id;

    // Find the existing application by its ID
    const existingApplication = await Application.findOne({ID: applicationId});
    if (!existingApplication) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check if the application has associated test plans, test cases, test runs, test results, defects, or users
    const hasAssociatedTestPlans = await TestPlan.exists({ application: applicationId });
    const hasAssociatedTestCases = await TestCase.exists({ application: applicationId });
    const hasAssociatedTestRuns = await TestRun.exists({ application: applicationId });
    const hasAssociatedTestResults = await TestResult.exists({ application: applicationId });
    const hasAssociatedDefects = await Defect.exists({ application: applicationId });
    const hasAssociatedUsers = await User.exists({ application: applicationId });

    // Check if the application has associated requirement, testPlan, testCase, testRun, testData, testResult, defect, or user
    if (
      existingApplication.requirement.length > 0 ||
      existingApplication.testPlan.length > 0 ||
      existingApplication.testCase.length > 0 ||
      existingApplication.testRun.length > 0 ||
      existingApplication.testData.length > 0 ||
      existingApplication.testResult.length > 0 ||
      existingApplication.defect.length > 0 ||
      existingApplication.user.length > 0
    ) {
      return res.status(400).json({ error: 'Cannot delete the application as it has associated items.' });
    }

    // If no associated items are found, proceed with the deletion
    await existingApplication.deleteOne();

    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error(error); // Log the error object for detailed information
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Add other controllers for updating, deleting, or performing other operations on applications if needed

module.exports = {
  getAllApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  getApplicationById,
  getApplicationByDesignedId
};