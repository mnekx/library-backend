const mongoose = require('mongoose');

const staffSchema = mongoose.Schema({
    role: {
        type: String,
        default: 'user'
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Staff', staffSchema);