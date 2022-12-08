import Users from '../../../models/userModelV2';

export default async function getUsernames() {
	const usernames = await Users.aggregate([
		{ $project: { _id: 0, username: 1 } },
		{ $group: { _id: null, usernames: { $push: '$username' } } },
		{ $project: { _id: 0 } },
	]);
	return usernames[0].usernames;
}
