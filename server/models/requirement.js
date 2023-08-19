const mongoose = require('mongoose');

const requirementSchema = new mongoose.Schema({
  ID: { type: String, required: true, unique: true },
  title: { type: String, required: true},
  description: { type: String, required: true},
  status: { type: String, required: true},
  priority: { type: String, required: false,},
  type: { type: String, required: true},
  dateCreated: { type: Date, required: true},
  dateUpdated: { type: Date, required: false},
  dependency: { type: String, required: false},    
  attachment: [ { type: String, }],
  createdBy: { type: String, required: false},
  testCase: [{ type: String, required: false }],
  testPlan: [{ type: String, required: false }],
});

// Define a pre-save hook to generate the auto-incrementing ID with prefix
requirementSchema.pre('save', async function (next) {
    if (this.isNew) {
      const count = await mongoose.model('Requirement').countDocuments();
      const prefix = 'REQ_';
      const incrementedValue = (count + 1).toString().padStart(3, '0');
      this.ID = prefix + incrementedValue;
    }
    next();
  });

const Requirement = mongoose.model('Requirement', requirementSchema);

module.exports = Requirement;