import { catchQueries } from '../saveQueries';
import { formatResponse } from '../../lib/helpers';

function middleware(req, res, next) {
	const { user } = req.session;
	if (user) {
		const currentDate = new Date();
		const expirationDate = new Date(user.expiration);
		if (user.expiration && currentDate > expirationDate) {
			res.status(401).send(formatResponse('Your account has expired'));
			req.session.destroy();
		} else {
			catchQueries(req);
			next();
		}
	} else {
		res.status(401).send(formatResponse('Please Sign in'));
	}
}

export default middleware;
