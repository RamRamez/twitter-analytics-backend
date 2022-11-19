import { Router } from 'express';

export const logoutRouter = Router();

logoutRouter.get('/', (req, res) => {
	req.session.destroy(() => {
		res.send('Successfully logged out')
	})
})