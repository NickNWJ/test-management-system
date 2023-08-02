const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationSchema = new mongoose.Schema({
    ID: { type: String, required: true, unique: true },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    applicationUrl: {
      type: String,
      required: true
    },
    platform: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: false
    },  
    requirement: [{
      type: String,
      required: false
    }],
    testPlan: [{
      type: String,
      required: false
    }],
    testCase: [{
        type: String,
        required: false
    }],
    testRun: [{
        type: String,
        required: false
    }],
    testData: [{
        type: String,
        required: false
    }],
    testResult: [{
        type: String,
        required: false
    }],
    defect: [{
        type: String,
        required: false
    }],
    user:[{
        type: String,
        required: false
    }]
  });

// Define a pre-save hook to generate the auto-incrementing ID with prefix
applicationSchema.pre('save', async function (next) {
  if (this.isNew) {
    const prefix = 'APP_';
    let incrementedValue = 1;
  
    while (true) {
      const incrementedId = prefix + incrementedValue.toString().padStart(3, '0');
      const existingApplication = await mongoose.model('Application').findOne({ ID: incrementedId });
  
      if (!existingApplication) {
        this.ID = incrementedId;
        break;
      }
  
      incrementedValue++;
    }
  }

  next();
});

const applicationModel = mongoose.model('Application', applicationSchema);

module.exports = applicationModel;