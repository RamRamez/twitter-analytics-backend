const Users = require('../../../models/userModelV2');

export default async function usersCount() {
	return Users.countDocuments();
}
