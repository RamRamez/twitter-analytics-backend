import { handleLog } from '../../lib/helpers';
import { IToken } from '../../types/token';
import Token from '../../models/tokenModel';
import ErrorTag from '../../lib/ErrorTag';

export default async function getToken(): Promise<IToken> {
	try {
		return Token.findOne();
	} catch (error) {
		handleLog(error, 'getToken');
		throw new ErrorTag(error, 'getToken');
	}
}
