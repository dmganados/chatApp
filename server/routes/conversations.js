// Dependencies and Modules
const exp = require('express');
const controller = require('../controller/conversations');
const Conversation = require('../model/Conversation');
const auth = require('../auth');



// Routing Component
const route = exp.Router();

// Create a connection with the other user before starting a conversation
route.post('/connect/:senderId/:receiverId', (req, res) => {    
    let sndr = req.params.senderId
    let rcvr = req.params.receiverId;
    let connect = {
        senderId: sndr,
        receiverId: rcvr
    }
    controller.connectUsers(connect).then(result => {
        res.send(result)
    })
});

// Get all the conversation of the current user
route.get('/connect/:senderId', (req, res) => {
    let user = req.params.senderId
    controller.getConvo(user).then(result => {
        res.send(result);
    })
});


// Expose Route System
module.exports = route;