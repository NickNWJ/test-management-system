const mongoose = require('mongoose');

const testDataSchema = new mongoose.Schema({
  ID: { type: String, required: true, unique: true },
  description: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    required: true
  },
  dateUpdated: {
    type: Date,
    required: true
  },
  attachment: [{
    type: String,
  }],
  createdBy: {
    type: String,
    required: true
  }
});

// Define a pre-save hook to generate the auto-incrementing ID with prefix
testDataSchema.pre('save', async function (next) {
    if (this.isNew) {
      const count = await mongoose.model('TestData').countDocuments();
      const prefix = 'TDA_';
      const incrementedValue = (count + 1).toString().padStart(3, '0');
      this.ID = prefix + incrementedValue;
    }
    next();
  });


const TestData = mongoose.model('TestData', testDataSchema);

module.exports = TestData;