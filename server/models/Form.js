const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    message: {
        type: String
    },
    interests: [String],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Form', FormSchema);