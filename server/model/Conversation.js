// [SECTION] Dependencies and Modules
const mongoose = require('mongoose');

// [SECTION] Schema
const conversationSchema = new mongoose.Schema(
    {
        users: {
            type: Array
        }
    },
    {
        timestamps: true
    }
    
);

// [SECTION] Model
module.exports = mongoose.model('Conversation', conversationSchema);