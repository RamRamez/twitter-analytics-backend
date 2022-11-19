import { Request, Response, Router } from 'express';
import { dashboardRoutes } from '../routes';
import tweetCount from '../functions/db/tweets/tweetCount';

export const dashboardRouter = Router();

dashboardRouter.get(dashboardRoutes.general, async (req: Request, res: Response) => {
	const { time } = req.query;

	const dashboardArray = await Promise.all([tweetCount(time)])
	const dashboardObject = {
		tweetCount: dashboardArray[0],
	}
	res.status(200).send(dashboardObject)
})