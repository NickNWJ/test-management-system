const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;
const testDataSchema = new Schema({
    ID: { type: Number, unique: tru },
    Description: { type: String, required: true },
    Status: { type: String, required: true },
    DataType: { type: String, required: true },
    DateCreated: { type: Date, required: true },
    DateUpdated: { type: Date, required: true },
    Attachment: { type: String },
    CreatedBy: { type: String }
});
testDataSchema.plugin(AutoIncrement, { id: 'testData_seq', inc_field: 'ID', prefix: 'TD_' });
const testDataModel = mongoose.model('testData', testDataSchema);
module.exports = testDataModel;