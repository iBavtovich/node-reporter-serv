const {users} = require('../users.json');

function getUserByUsername(username) {
	return users.find(user => user.username === username);
}

function getTokenByUserId(id) {
	return users.find(user => user.id === id).token;
}

function updateUserToken(id, token) {
	users.find(user => user.id === id).token = token;
}

function getUserIfTokenValid(token) {
	return users.find(user => user.token === token);
}

module.exports.getUserByUsername = getUserByUsername;
module.exports.getTokenByUserId = getTokenByUserId;
module.exports.updateUserToken = updateUserToken;
module.exports.getUserIfTokenValid = getUserIfTokenValid;
