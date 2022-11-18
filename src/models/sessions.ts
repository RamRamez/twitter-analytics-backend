const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sessions = new Schema({
	_id: { type: String, required: true },
	session: { type: String, required: true },
	expires: { type: Date, required: true },
});

const sessionSchema = mongoose.model('sessions', sessions, 'sessions');

module.exports = sessionSchema;
