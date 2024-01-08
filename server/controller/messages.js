const Message = require('../model/Message');

// Create message
module.exports.addMessage = (data) => {
    let convoId = data.conversationId;
    let convo = data.message;
    let sndr = data.sender;

    let newMessage = new Message({
        conversationId: convoId,
        message: convo,
        sender: sndr
    });

    return newMessage.save().then((message, error) => {
        if (message) {
            return message;
        } else {
            return false;
        }
    });
}

// Retrieve message
module.exports.getMessage = (id) => {
    return Message.find({conversationId:id}).then(res => {
        return res
    })
}

