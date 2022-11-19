import { model, Schema } from 'mongoose';

const sessionModel = new Schema({
	_id: { type: String, required: true },
	session: { type: String, required: true },
	expires: { type: Date, required: true },
});

const sessionSchema = model('sessionModel', sessionModel, 'sessions');

module.exports = sessionSchema;
