import { Router } from 'express';
import { formatResponse } from '../lib/helpers';

const logoutRouter = Router();

logoutRouter.get('/', (req, res) => {
	req.session.destroy(() => {
		res.send(formatResponse('Successfully logged out'));
	});
});

export default logoutRouter;
