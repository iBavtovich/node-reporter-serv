const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('users.json');
const db = low(adapter);

const updateImage = (id, photo) => {
	db.get('users')
		.find({id})
		.value().photo = photo;
	db.write();
	console.log('Photo was updated for user with id: ' + id);
};

module.exports = updateImage;
