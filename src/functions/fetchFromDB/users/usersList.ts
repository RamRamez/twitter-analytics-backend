import Users from '../../../models/userModelV2';

export default async function usersList() {
	return Users.aggregate([{ $project: { _id: 0, username: 1, name: 1 } }]);
}
