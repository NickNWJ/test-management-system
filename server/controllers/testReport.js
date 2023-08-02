const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;
const testReportSchema = new Schema({
    ID: { type: Number, unique: tru },
    Name: { type: String, required: true },
    Description: { type: String, required: true },
    Type: { type: String, required: true },
    Status: { type: String, required: true },
    DateCreated: { type: Date, required: true },
    DateUpdated: { type: Date, required: true },
    CreatedBy: { type: String },
    TestResult_ID: { type: String }
});
testReportSchema.plugin(AutoIncrement, { id: 'testReport_seq', inc_field: 'ID', prefix: 'TREP_' });
const testReportModel = mongoose.model('testReport', testReportSchema);
module.exports = testReportModel;