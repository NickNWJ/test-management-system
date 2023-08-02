const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  ID: { type: Number, unique: true },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
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
  testSteps:{
    type: String,
    required: false
  },
  expectedResult:{
    type: String,
    required: false 
  },
  defects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Defect',
    required: false
  }],
  testData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TestData',
    required: false
  },
  requirement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Requirement',
    required: false
  },
  attachment: [{
    type: String,
  }],
  testData: {
    type: String,
    required: false
  },
  testEnvironment: {
    type: String,
    required: false
  },
  testPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TestPlan',
    required: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  testResult: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TestResult',
    required: false
  }
});

const TestCase = mongoose.model('TestCase', testCaseSchema);

module.exports = TestCase;