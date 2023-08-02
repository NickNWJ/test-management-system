const mongoose = require('mongoose');

const testRunSchema = new mongoose.Schema({
  ID: { type: String, required: true, unique: true },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    required: true
  },
  dateUpdated: {
    type: Date,
    required: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  executionTimeTaken: {
    type: Number,
  },
  testCase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TestCase',
    required: true
  },
  automationTestScript: {
    type: String,
    required: true
  },
  testResult: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TestResult',
    required: false
  },
  logs: [
    {
      timestamp: {
        type: Date,
      },
      message: {
        type: String,
      }
    }
  ],
});

// Define a pre-save hook to generate the auto-incrementing ID with prefix
testRunSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await mongoose.model('TestRun').countDocuments();
    const prefix = 'TR_';
    const incrementedValue = (count + 1).toString().padStart(3, '0');
    this.ID = prefix + incrementedValue;
  }
  next();
});


const TestRun = mongoose.model('TestRun', testRunSchema);

module.exports = TestRun;