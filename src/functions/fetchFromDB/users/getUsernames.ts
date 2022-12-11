import Users from '../../../models/userModelV2';
import { handleLog } from '../../../lib/helpers';
import ErrorTag from '../../../lib/ErrorTag';

export default async function getUsernames(): Promise<string[]> {
	try {
		const usernames = await Users.aggregate([
			{ $project: { _id: 0, username: 1 } },
			{ $group: { _id: null, usernames: { $push: '$username' } } },
			{ $project: { _id: 0 } },
		]);
		return usernames[0]?.usernames;
	} catch (error) {
		handleLog(error, 'getUsernames');
		throw new ErrorTag(error, 'getUsernames');
	}
}
