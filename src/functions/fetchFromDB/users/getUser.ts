import Users from '../../../models/userModelV2';

export default async function getUser(username) {
	return Users.findOne({ username });
}
