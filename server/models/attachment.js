// attachment.js
const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
  filename: { type: String },
  contentType: { type: String },
  sourceModel: { type: String }, // Store the source model (e.g., 'Requirement', 'TestCase', etc.)
  data: Buffer, // Store the file buffer
  sourceId: { type: String }, // Store the corresponding ID from the source model
  createdAt: { type: Date, default: Date.now() }, // Add the createdAt field with the default value set to the current time
});

const Attachment = mongoose.model('Attachment', attachmentSchema);

module.exports = Attachment;