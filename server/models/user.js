const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  ID: { type: String, required: true, unique: true },
  Name: { type: String, required: true },
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  Phone: { type: String, required: false },
  Bio: { type: String, required: false },
  Role: { type: String, required: true }
});

// Define a pre-save hook to generate the auto-incrementing ID with prefix
userSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await mongoose.model('User').countDocuments();
    const prefix = 'US_';
    const incrementedValue = (count + 1).toString().padStart(3, '0');
    this.ID = prefix + incrementedValue;
  }
  next();
});

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;