const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userActivity = new Schema({
	username: { type: String, required: true },
	query: { type: String, required: true },
	body: { type: Object, required: false },
	userAgent: { type: String, required: false },
	sessionId: { type: String, required: false },
	date: { type: Date, required: true },
	ip: { type: String, required: true },
});

const twSchema = mongoose.model('userActivity', userActivity, 'userActivity');

module.exports = twSchema;
