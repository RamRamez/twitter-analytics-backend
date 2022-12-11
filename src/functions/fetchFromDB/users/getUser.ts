import Users from '../../../models/userModelV2';
import { IUser } from '../../../types/user';

export default async function getUser(username: string): Promise<IUser> {
	return Users.findOne({ username });
}
