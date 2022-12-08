import { Router } from 'express';
import { formatResponse } from '../lib/helpers';

const isSignedInRouter = Router();

isSignedInRouter.get('/', (req, res) => {
	if (req.session.user) {
		res.send({
			name: req.session.user.name,
			role: req.session.user.role,
		});
	} else {
		res.status(401).send(formatResponse('You are not signed in'));
	}
});

export default isSignedInRouter;
