import Users from '../../../models/userModelV2';
import { IUserList } from '../../../types/api';

export default async function usersList(): Promise<IUserList[]> {
	return Users.aggregate([{ $project: { _id: 0, username: 1, name: 1 } }]);
}
