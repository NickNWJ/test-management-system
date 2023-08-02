const mongoose = require('mongoose');

const testReportSchema = new mongoose.Schema({
  ID: { type: String, required: true, unique: true },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  status: {
    type: String,
  },
  attachment: [{
    type: String,
  }],
  testCase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TestCase',
    required: true
  }
});

// Define a pre-save hook to generate the auto-incrementing ID with prefix
testReportSchema.pre('save', async function (next) {
    if (this.isNew) {
      const count = await mongoose.model('TestReport').countDocuments();
      const prefix = 'TRPT_';
      const incrementedValue = (count + 1).toString().padStart(3, '0');
      this.ID = prefix + incrementedValue;
    }
    next();
  });


const TestReport = mongoose.model('TestReport', testReportSchema);

module.exports = TestReport;