require('dotenv').config();
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const userModel = require('../models/user');
const applicationModel = require('../models/application');
const defectModel = require('../models/defect');
const requirementModel = require('../models/requirement');
const testCaseModel = require('../models/testCase');
const testDataModel = require('../models/testData');
const testPlanModel = require('../models/testPlan');
const testResultModel = require('../models/testResult');
const testReportModel = require('../models/testReport');

// gridfs <- handle file upload
const multer = require('multer');
const Grid = require('gridfs-stream');
// Create a storage engine for multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uri = process.env.MONGODB_URI;

// generate the account number to the user
function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Connect to MongoDB database
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log(`Connection established to MongoDB ATest-Management Server!`))
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Initialize GridFS and create a connection to the database
let gfs;
const connection = mongoose.connection;
connection.once('open', () => {
  gfs = Grid(connection.db, mongoose.mongo);
  gfs.collection('attachments'); // Use the name of the collection where you want to store the attachments
});


module.exports = function(req, res, next) {
  req.db = mongoose.connection;
  next();
};