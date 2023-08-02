const mongoose = require('mongoose');

const testPlanSchema = new mongoose.Schema({
  ID: { type: String, required: true, unique: true },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  scope: {
    type: String,
    required: false
  },
  goal: {
    type: String,
    required: false
  },
  schedule: {
    type: String,
    required: false
  },
  startDate: {
    type: Date,
    required: false
  },
  attachment: [{
    type: String,
  }],
  status: {
    type: Boolean,
    required: false
  },
  createdby: {
    type: String,
    required: false
  },
  testCases: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TestCase',
    required: false
  }],
});

// Define a pre-save hook to generate the auto-incrementing ID with prefix
testPlanSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await mongoose.model('TestPlan').countDocuments();
    const prefix = 'TP_';
    const incrementedValue = (count + 1).toString().padStart(3, '0');
    this.ID = prefix + incrementedValue;
  }
  next();
});


const TestPlan = mongoose.model('TestPlan', testPlanSchema);

module.exports = TestPlan;