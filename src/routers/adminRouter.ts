import { Request, Response, Router } from 'express';
import { adminRoutes } from '../routes';
import { formatResponse } from '../lib/helpers';
const SystemUsers = require('../models/systemUsers');

export const adminRouter = Router();

const { addUser } = adminRoutes;

adminRouter.post(addUser, async (req: Request, res: Response) => {
	const user = req.body;
	const { username, password, name, role } = user;
	if (name && username && password && role) {
		const dbUser = await SystemUsers.findOne({ username });
		if (dbUser?.username) {
			res.status(401).send(formatResponse('Username already exists'));
		} else {
			const newUser = new SystemUsers(user);
			await newUser.save();
			res.send(formatResponse('User added successfully'));
		}
	} else {
		res.status(401).send(formatResponse('Please fill required fields'));
	}
});
