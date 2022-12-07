import { Request, Response, Router } from 'express';
import { adminRoutes } from '../routes';
import { formatResponse, handleLog } from '../lib/helpers';
import insertToken from '../functions/saveToDB/insertToken';
import getToken from '../functions/fetchFromDB/getToken';
const SystemUsers = require('../models/systemUsers');

export const adminRouter = Router();

adminRouter.post(adminRoutes.addUser, async (req: Request, res: Response) => {
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

adminRouter.get(adminRoutes.token, async (req: Request, res: Response) => {
	try {
		const token = await getToken();
		res.send(token || formatResponse('No token found'));
	} catch (error) {
		!error.tag && handleLog(error, 'adminRoutes.token.get');
		res.status(500).send(formatResponse('Error getting token!'));
	}
});

adminRouter.post(adminRoutes.token, async (req: Request, res: Response) => {
	try {
		const { token } = req.body;
		if (token) {
			await insertToken(token);
			res.send(formatResponse('Token added successfully'));
		} else {
			res.status(401).send(formatResponse('Token is required'));
		}
	} catch (error) {
		!error.tag && handleLog(error, 'adminRoutes.token.post');
		res.status(500).send(formatResponse('Error adding token!'));
	}
});