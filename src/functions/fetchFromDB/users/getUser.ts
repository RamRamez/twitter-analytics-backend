const Users = require('../../../models/userModelV2');

export default async function getUser(username) {
	return Users.findOne({ username });
}
