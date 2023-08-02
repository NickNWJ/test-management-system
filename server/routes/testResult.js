const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;
const testResultSchema = new Schema({
    ID: { type: Number, unique: tru },
    Name: { type: String, required: true },
    Description: { type: String, required: true },
    Status: { type: String, required: true },
    ExecutionDate: { type: Date, required: true },
    ExecutionTime: { type: String, required: true },
    TestCase_ID: { type: String }
  });
testResultSchema.plugin(AutoIncrement, { id: 'testResult_seq', inc_field: 'ID', prefix: 'TRES_' });
const testResultModel = mongoose.model('testResult', testResultSchema);
module.exports = testResultModel;