const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;
const defectSchema = new Schema({
    ID: { type: Number, unique: tru },
    Description: { type: String, required: true },
    Status: { type: String, required: true },
    Severity: { type: String, required: true },
    Priority: { type: String, required: true },
    ReproduceSteps: { type: String, required: true },
    DateCreated: { type: Date, required: true },
    DateUpdated: { type: Date, required: true },
    DetectedBy: { type: String },
    ResolvedBy: { type: String },
    TestResult_ID: { type: String }
});
defectSchema.plugin(AutoIncrement, { id: 'defect_seq', inc_field: 'ID', prefix: 'DEF_' });
const defectModel = mongoose.model('defect', defectSchema);
module.exports = defectModel;