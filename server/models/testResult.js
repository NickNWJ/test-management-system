const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
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
  executionDate: {
    type: Date,
    required: true
  },
  executionTime: {
    type: String,
    required: true
  },
  testCase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TestCase',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});


// Define a pre-save hook to generate the auto-incrementing ID with prefix
testResultSchema.pre('save', async function (next) {
    if (this.isNew) {
      const count = await mongoose.model('TestResult').countDocuments();
      const prefix = 'TRES_';
      const incrementedValue = (count + 1).toString().padStart(3, '0');
      this.ID = prefix + incrementedValue;
    }
    next();
  });

const TestResult = mongoose.model('TestResult', testResultSchema);

module.exports = TestResult;