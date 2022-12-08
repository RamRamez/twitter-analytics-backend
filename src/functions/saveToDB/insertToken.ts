import Token from '../../models/tokenModel';

export default async function insertToken(token: string) {
	try {
		await Token.findOneAndUpdate({}, { token }, { upsert: true });
	} catch {
		return;
	}
}
