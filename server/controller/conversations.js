const Conversation = require('../model/Conversation');

// Create a connection with the other user before starting a conversation
module.exports.connectUsers = (data) => {
    let sndr = data.senderId;
    let rcver = data.receiverId;

    let newConvo = new Conversation({
        users: [sndr, rcver]
    });

    return newConvo.save().then((convo, error) => {
        if (convo) {
            return convo;
        } else {
            return false;
        }
    });
};

// Get all the conversation of the current user
module.exports.getConvo = (id) => {
    return Conversation.find({users:id}).then(res => {
        return res
    });
};