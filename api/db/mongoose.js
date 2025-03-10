const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://manji:manji@cluster0.dcblk.mongodb.net/').then(() => {
    console.log('Connected to MongoDB');
}).catch(() => {
    console.error('Failed to connect to MongoDB');
});

module.exports = {
    mongoose
};