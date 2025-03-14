const mongoose = require('mongoose');
const config = require('../config');

// Connect to MongoDB with improved options
mongoose.connect(config.MONGODB_URI, {
  // These options are no longer needed in Mongoose 8+
  // They're handled automatically by the driver
}).then(() => {
    console.log('Connected to MongoDB successfully');
}).catch((error) => {
    console.error('Failed to connect to MongoDB');
    console.error(error);
});

module.exports = {
    mongoose
};