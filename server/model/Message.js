// [SECTION] Dependencies and Modules
const mongoose = require('mongoose');

// [SECTION] Schema
const messageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: String
        },
        sender: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true            
        }       
    },
    {
        timestamps: true
    }    
);

// [SECTION] Model
module.exports = mongoose.model('Message', messageSchema);