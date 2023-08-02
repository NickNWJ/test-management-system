const Application = require('../models/application');
const Requirement = require('../models/requirement');
const TestPlan = require('../models/testPlan');

// Function to generate a unique application ID
async function generateUniqueTestPlanId() {
  const prefix = 'TP_';
  let incrementedValue = 1;

  while (true) {
    const incrementedId = prefix + incrementedValue.toString().padStart(3, '0');
    const existingApplication = await TestPlan.findOne({ ID: incrementedId });

    if (!existingApplication) {
      return incrementedId;
    }

    incrementedValue++;
  }
}

// Function to check if a test plan is linked to any application or requirement
async function isTestPlanLinked(testPlanId) {
    try {
      // Check if the test plan ID is linked to any application
      const linkedToApplications = await Application.exists({ testPlan: testPlanId });
  
      // Check if the test plan ID is linked to any requirement
      const linkedToRequirements = await Requirement.exists({ testPlan: testPlanId });
  
      return linkedToApplications || linkedToRequirements;
    } catch (error) {
      console.error(error);
      return true; // To be cautious, assume it's linked if there's an error
    }
}

// CREATE a new test plan
async function createTestPlan(req, res) {
  try {
    const { name, description, scope, goal, schedule, startDate, attachment, status, createdby, testCases } = req.body;

    const newTestPlan = new TestPlan({
      name,
      description,
      scope,
      goal,
      schedule,
      startDate,
      attachment,
      status,
      createdby,
      testCases,
    });

    newTestPlan.ID = await generateUniqueTestPlanId();

    console.log("new TP ID" + newTestPlan.ID);

    const savedTestPlan = await newTestPlan.save();
    res.status(201).json(savedTestPlan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// READ all test plans
async function getAllTestPlans(req, res) {
  try {
    const testPlans = await TestPlan.find();
    res.status(200).json(testPlans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch test plans.' });
  }
}

// READ a single test plan by ID
async function getTestPlanByID(req, res) {
  try {
    const { id } = req.params;
    const testPlan = await TestPlan.find({ ID: id});
    if (!testPlan) {
      return res.status(404).json({ error: 'Test plan not found.' });
    }
    res.status(200).json(testPlan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch test plan.' });
  }
}

// READ a single test plan by ID
async function getTestPlanById(req, res) {
    try {
      const { id } = req.params;
      const testPlan = await TestPlan.findById(id);
      if (!testPlan) {
        return res.status(404).json({ error: 'Test plan not found.' });
      }
      res.status(200).json(testPlan);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch test plan.' });
    }
  }

// UPDATE a test plan by Id
async function updateTestPlanById(req, res) {
  try {
    const { testPlanId } = req.params.id;

    // Find the existing test plan by its ID
    const existingTestPlan = await TestPlan.find({ ID: testPlanId });
    if (!existingTestPlan) {
      return res.status(404).json({ error: 'Test plan not found.' });
    }

    // Get the update fields from the request body
    const {
      name,
      description,
      scope,
      goal,
      schedule,
      startDate,
      attachment,
      status,
      createdby,
      testCases,
    } = req.body;

    // Update only the provided fields and keep the previous value if the field is not present in the request body
    existingTestPlan.name = name || existingTestPlan.name;
    existingTestPlan.description = description || existingTestPlan.description;
    existingTestPlan.scope = scope || existingTestPlan.scope;
    existingTestPlan.goal = goal || existingTestPlan.goal;
    existingTestPlan.schedule = schedule || existingTestPlan.schedule;
    existingTestPlan.startDate = startDate || existingTestPlan.startDate;
    existingTestPlan.attachment = attachment || existingTestPlan.attachment;
    existingTestPlan.status = status || existingTestPlan.status;
    existingTestPlan.createdby = createdby || existingTestPlan.createdby;

    // If the testCases are provided, they should be an array of ObjectIds
    if (testCases && Array.isArray(testCases)) {
      existingTestPlan.testCases = testCases;
    }

    const updatedTestPlan = await existingTestPlan.save();

    res.status(200).json(updatedTestPlan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update test plan.' });
  }
}


// DELETE a test plan by ID
async function deleteTestPlanById(req, res) {
  try {
    const { id } = req.params;
    const deletedTestPlan = await TestPlan.findByIdAndDelete(id);
    if (!deletedTestPlan) {
      return res.status(404).json({ error: 'Test plan not found.' });
    }
    res.status(200).json({ message: 'Test plan deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete test plan.' });
  }
}

module.exports = {
  createTestPlan,
  getAllTestPlans,
  getTestPlanByID,
  getTestPlanById,
  updateTestPlanById,
  deleteTestPlanById,
};