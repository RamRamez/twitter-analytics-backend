import Users from '../../../models/userModelV2';

export default async function usersCount(): Promise<number> {
	return Users.countDocuments();
}
