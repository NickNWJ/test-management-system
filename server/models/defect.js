const mongoose = require('mongoose');

const defectSchema = new mongoose.Schema({
  ID: { type: String, required: true, unique: true },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    required: true
  },
  reproduceSteps: {
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
  detectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  attachment: [{
    type: String // Store the filename
  }],
  testResult: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TestResult',
    required: true
  }
});

// Define a pre-save hook to generate the auto-incrementing ID with prefix
defectSchema.pre('save', async function (next) {
    if (this.isNew) {
      const count = await mongoose.model('Defect').countDocuments();
      const prefix = 'DEF_';
      const incrementedValue = (count + 1).toString().padStart(3, '0');
      this.ID = prefix + incrementedValue;
    }
    next();
  });


const Defect = mongoose.model('Defect', defectSchema);

module.exports = Defect;