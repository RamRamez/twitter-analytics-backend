import { model, Schema } from 'mongoose';

const userActivity = new Schema({
	username: { type: String, required: true },
	query: { type: String, required: true },
	body: { type: Object, required: false },
	userAgent: { type: String, required: false },
	sessionId: { type: String, required: false },
	date: { type: Date, required: true },
	ip: { type: String, required: true },
});

const UserActivity = model('userActivity', userActivity, 'userActivity');

export default UserActivity;
