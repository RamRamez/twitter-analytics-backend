import { Router } from 'express';
import { catchQueries } from '../functions/saveQueries';
const SystemUsers = require('../models/systemUsers')

export const loginRouter = Router();

loginRouter.post('/', async (req, res) => {
	const { username, password } = req.body
	if (!username || !password) {
		res.status(400).send("Username or password is missing")
	}
	else {
		const dbUser = await SystemUsers.findOne({username, password})
		if (dbUser) {
			const currentDate = new Date()
			const expirationDate = new Date(dbUser.expiration)
			if (dbUser.expiration && currentDate > expirationDate) {
				res.status(401).send("Your account has expired")
			}
			req.session.user = {
				username,
				name: dbUser.name,
				role: dbUser.role,
				expiration: dbUser.expiration
			}
			catchQueries(req)
			res.send('Welcome ' + dbUser.name)
		}
		else {
			res.status(401).send("Wrong username or password")
		}
	}
})