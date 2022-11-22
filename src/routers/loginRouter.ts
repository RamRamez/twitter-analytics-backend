import { Router } from 'express';
import { catchQueries } from '../functions/saveToDB/saveQueries';
import { formatResponse } from '../lib/helpers';
const SystemUsers = require('../models/systemUsers');

export const loginRouter = Router();

loginRouter.post('/', async (req, res) => {
	const { username, password } = req.body;
	if (!username || !password) {
		res.status(401).send(formatResponse('Username or password is missing'));
	} else {
		const dbUser = await SystemUsers.findOne({ username, password });
		if (dbUser) {
			const currentDate = new Date();
			const expirationDate = new Date(dbUser.expiration);
			if (dbUser.expiration && currentDate > expirationDate) {
				res.status(401).send(formatResponse('Your account has expired'));
			}
			req.session.user = {
				username,
				name: dbUser.name,
				role: dbUser.role,
				expiration: dbUser.expiration,
			};
			catchQueries(req);
			res.send({
				name: dbUser.name,
				role: dbUser.role,
			});
		} else {
			res.status(401).send(formatResponse('Wrong username or password'));
		}
	}
});
