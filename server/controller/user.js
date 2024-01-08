// Dependencies and Modules
const User = require('../model/User');
const bcrypt = require('bcrypt');
const auth = require('../auth');
const { model } = require('mongoose');

// User Registration
module.exports.userReg = (reg) => {
    let fName = reg.firstName;
    let lName = reg.lastName;
    let email = reg.email;    
    let passW = reg.password;

    let newUser = new User({
        firstName: fName,
        lastName: lName,
        email: email,        
        password: bcrypt.hashSync(passW, 10),       
    });
    return newUser.save().then((user, error) => {
        if (user) {
            return user;
        } else {
            return false;
        }
    });

}

// Create token to be used when user logs in. 
module.exports.userToken = (reqBody) => {
    return User.findOne({email: reqBody.email}).then(outcome => {
        let passW = reqBody.password;
        if (outcome === null) {
            return false;
        }else {
            const isMatched = bcrypt.compareSync(passW, outcome.password);
            if (isMatched) {
                let userData = outcome.toObject();
                return {accessToken: auth.userAccessToken(userData)};
            } else {
                return false;
            }
        }

    })
};

// Retrieve Users
module.exports.getUsers = (id) => {
    return User.findById(id).then(outcome => {	
        let id = outcome._id;
        let fName = outcome.firstName;
        let lName = outcome.lastName;
        let email = outcome.email;
        let passW = outcome.password;
        let userInfo = {
            _id: id,
            firstName: fName,
            lastName: lName,
            email: email,
            password: passW,
        }
        return userInfo;
    });
};

module.exports.getAllUsers = () => {
    return User.find({}).then(result => {
        return result
    });
};

module.exports.findUsers = (id) => {
    return User.findById(id).then(result => {
        if (result) {
            return result
        } else {
            return false
        }
    });
};

// Update user information
module.exports.updateUser = (id, data) => {
    let fName = data.firstName;
    let lName = data.lastName;
    let email = data.email;    
    let updated = {
        firstName: fName,
        lastName: lName
    }

    return User.findByIdAndUpdate(id, updated).then((profileUpdated, err) => {
        if (profileUpdated) {
            return(profileUpdated)
        } else {
            return 'Failed to update profile'
        }
    })
}

// Delete account
module.exports.deleteProfile = (id) => {
    return User.findById(id).then(userId => {
        if (userId === null) {
            return 'Account not found'
        } else {
            return userId.remove().then((profileRemoved, err) => {
                if (err) {
                    return 'Failed to delete'
                } else {
                    return 'Account deleted'
                }
            })
        }
    })
}