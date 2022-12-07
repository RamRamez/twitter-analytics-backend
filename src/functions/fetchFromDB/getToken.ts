import { handleLog } from '../../lib/helpers';
import { IToken } from '../../types/token';

const Token = require('../../models/tokenModel');

export default async function getToken(): Promise<IToken> {
	try {
		return Token.findOne();
	} catch (error) {
		handleLog(error, 'getToken');
		throw { ...error, tag: 'getToken' };
	}
}
