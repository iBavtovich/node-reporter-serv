const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const shortid = require('shortid');

const adapter = new FileSync('users.json');
const db = low(adapter);

var updateImage = function updateImage(id, photo) {
    console.log(photo);
    db.find({id: id}).photo = photo;
    db.save();

};

module.exports = updateImage;