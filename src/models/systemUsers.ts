const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const systemUsers = new Schema({
	name: { type: String, required: true },
	username: { type: String, required: true },
	password: { type: String, required: true },
	role: { type: String, required: true },
	expiration: { type: Date, required: false },
});

const userSchema = mongoose.model('systemUsers', systemUsers, 'systemUsers');

module.exports = userSchema;
