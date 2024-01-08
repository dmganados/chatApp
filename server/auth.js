// Dependencies and Modules
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Environment Variable Setup
dotenv.config();
let secret = process.env.SECRET;

// Functionalities
module.exports.userAccessToken = (authUser) => {
	let userInfo = {
		id:authUser._id,
		firstName:authUser.firstName,
		lastName:authUser.lastName,
		email:authUser.email,
	};
	return jwt.sign(userInfo, secret, {});
};

module.exports.verify = (req, res, next) => {
	let token = req.headers.authorization;
	if (typeof token !== 'undefined') {
		token = token.slice(7, token.length);
		jwt.verify(token, secret, (err, payload) => {
			if (err) {
				return res.send({auth: 'Authorization Failed'})
			} else {
				next()
			}
		})
	} else {
		return res.send({auth: "Authorization Failed, Check Token"});
	};
};

module.exports.decode = (accessToken) => {
	if (typeof accessToken !== 'undefined') {
		accessToken = accessToken.slice(7, accessToken.length);
		return jwt.verify(accessToken, secret, (err, verified) => {
			if (err) {
				return null;
			} else {
				return jwt.decode(accessToken, {complete: true}).payload;
			}
		})
	} else {
		return null;
	}
}