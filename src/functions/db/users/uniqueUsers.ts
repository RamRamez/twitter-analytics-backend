const Users = require('../../../models/userModelV2');

export default async function uniqueUsers() {
	return Users.countDocuments();
}
