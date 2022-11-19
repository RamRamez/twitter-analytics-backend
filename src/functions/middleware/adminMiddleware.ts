import { EUserRole } from '../../types/userRole';
import { Request, Response, NextFunction } from 'express';

function adminMiddleware (req: Request, res: Response, next: NextFunction) {
  if (req.session.user.role === EUserRole.admin) {
	next()
  } else {
	res.status(403).send('Unauthorized')
  }
}

export default adminMiddleware
