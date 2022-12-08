import Users from '../../../models/userModelV2';

export default async function usersCount() {
	return Users.countDocuments();
}
