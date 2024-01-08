// Dependencies and Modules
    const exp = require('express');
    const controller = require('../controller/user');
    const auth = require('../auth');


// Routing Component
    const route = exp.Router();

// Routes - Create
    route.post('/register', (req, res) => {
        let userInfo = req.body;
        controller.userReg(userInfo).then(result => {
            res.send(result)
        })
    })

    route.post('/login', (req, res) => {
        let data = req.body;
        controller.userToken(data).then(result => {
            res.send(result);
        })
    })

// Routes - Retrieve
    route.get('/profile', auth.verify, (req, res) => {
        let userData = auth.decode(req.headers.authorization);
        let userId = userData.id;
        controller.getUsers(userId).then(outcome => {
            res.send(outcome);
        });
    });

    route.get('/all-users', (req, res) => {
        controller.getAllUsers().then(result => {
            res.send(result)
        })
    })

    route.get('/profile/:friendId', (req, res) => {
        let userId = req.params.friendId
        controller.findUsers(userId).then(outcome => {
            res.send(outcome);
        });
    });

// Routes - Update
    route.put('/profile/update/:userId', (req, res) => {
        let id = req.params.userId
        let userInfo = req.body;
        controller.updateUser(id, userInfo).then((result => {
            res.send(result)
        }))    
    })

// Routes - Delete
    route.delete('/profile/delete/:userId', (req, res) => {
        let id = req.params.userId
        controller.deleteProfile(id).then(result => {
            res.send(result)
        })
    })


// Expose Route System
    module.exports = route;