import { model, Schema } from 'mongoose';

const systemUsers = new Schema({
	name: { type: String, required: true },
	username: { type: String, required: true },
	password: { type: String, required: true },
	role: { type: String, required: true },
	expiration: { type: Date, required: false },
});

const userSchema = model('systemUsers', systemUsers, 'systemUsers');

module.exports = userSchema;
