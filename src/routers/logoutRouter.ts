import { Router } from 'express';
import { formatResponse } from '../lib/helpers';

export const logoutRouter = Router();

logoutRouter.get('/', (req, res) => {
	req.session.destroy(() => {
		res.send(formatResponse('Successfully logged out'));
	});
});
