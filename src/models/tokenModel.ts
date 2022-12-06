import { model, Schema } from 'mongoose';

const tokenModel = new Schema({
	token: { type: String, required: true },
});

const tokenSchema = model('tokenModel', tokenModel, 'token');

module.exports = tokenSchema;
