import { model, Schema } from 'mongoose';

const sessionModel = new Schema({
	_id: { type: String, required: true },
	session: { type: String, required: true },
	expires: { type: Date, required: true },
});

const Session = model('sessionModel', sessionModel, 'sessions');

export default Session;
