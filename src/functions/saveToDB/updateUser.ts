import { IUser } from '../../types/user';

const Users = require('../../models/userModelV2');

export async function updateUser(user: IUser) {
	return Users.findOneAndUpdate({ id: user.id }, user, {upsert: true})
}