const data = require('../users.json');

try {
	const users = data.users;
} catch (err) {
	console.error(err)
}

function getUserByUsername(username) {
	return  users.find(user => user.username === username);
}


function getTokenByUserId(id) {
	return users.find(user => user.id === id).token;
}

function updateUserToken(id, token) {
	users.find(user => user.id === id).token = token;
}

function isTokenValid(token) {
	let validUser = users.find(user => user.token === token);
	if (validUser) {
		return true;
	} else {
		return false;
	}
}


module.exports.getUserByUsername = getUserByUsername;
module.exports.getTokenByUserId = getTokenByUserId;
module.exports.updateUserToken = updateUserToken;
module.exports.isValidToken = isTokenValid;