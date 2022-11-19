import { Router } from 'express';

export const isSignedInRouter = Router();

isSignedInRouter.get('/', (req, res) => {
	if (req.session.user) {
		res.send({
			name: req.session.user.name,
			role: req.session.user.role
		})
	}
	else {
		res.status(401).send('Please Sign in')
	}
})