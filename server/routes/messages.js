// Dependencies and Modules
const exp = require('express');
const controller = require('../controller/messages');
const auth = require('../auth');

// Routing Component
const route = exp.Router();

// Create Message
route.post('/messages/:senderId', (req, res) => {
    let convoId = req.body.conversationId;
    let msgs = req.body.message;
    let sndr = req.params.senderId;
    let msgData = {
        conversationId: convoId,
        message: msgs,
        sender: sndr
    }
    controller.addMessage(msgData).then(result => {
        res.send(result)
    })
});

// Retrieve Message
route.get('/messages/:conversationId', (req, res) => {
    let convoId = req.params.conversationId;
    controller.getMessage(convoId).then(result => {
        res.send(result);
    })
});

// Expose Route System
module.exports = route;