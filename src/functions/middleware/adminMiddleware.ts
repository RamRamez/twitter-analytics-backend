import { Request, Response, NextFunction } from 'express';
import EUserRole from '../../types/userRole';
import { formatResponse } from '../../lib/helpers';

function adminMiddleware(req: Request, res: Response, next: NextFunction) {
	if (req.session.user.role === EUserRole.admin) {
		next();
	} else {
		res.status(403).send(formatResponse('Unauthorized'));
	}
}

export default adminMiddleware;
