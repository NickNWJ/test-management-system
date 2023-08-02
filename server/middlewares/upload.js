const multer = require('multer');

// Create a storage engine for multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;