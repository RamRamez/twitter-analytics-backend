const Users = require('../../../models/userModelV2');

export default async function userIds() {
	const ids = await Users.aggregate([
		{ $project: { _id: 0, id: 1 } },
		{ $group: { _id: null, ids: { $push: '$id' } } },
		{ $project: { _id: 0 } },
	]);
	return ids[0].ids;
}
