import { IUser } from '../../types/user';
import Users from '../../models/userModelV2';

export default async function updateUser(user: IUser): Promise<void> {
	try {
		await Users.findOneAndUpdate({ id: user.id }, user, { upsert: true });
	} catch {
		return;
	}
}
