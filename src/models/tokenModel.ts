import { model, Schema } from 'mongoose';

const tokenModel = new Schema({
	token: { type: String, required: true },
});

const Token = model('tokenModel', tokenModel, 'token');

export default Token;
