import { Request, Response, Router } from 'express';
import { dashboardRoutes } from '../routes';
import tweetCount from '../functions/db/tweets/tweetCount';
import uniqueUsers from '../functions/db/users/uniqueUsers';
import uniqueHashtagsCount from '../functions/db/tweets/uniqueHashtagsCount';
import hashtagsAbundance from '../functions/db/tweets/hashtagsAbundance';
import mostInfluentialTweets from '../functions/db/tweets/mostInfluentialTweets';

export const dashboardRouter = Router();

dashboardRouter.get(dashboardRoutes.general, async (req: Request, res: Response) => {
	const { timeRange } = req.query;
	const dashboardArray = await Promise.all([
		tweetCount(timeRange),
		uniqueUsers(),
		uniqueHashtagsCount(timeRange),
		hashtagsAbundance(timeRange),
	]);
	const dashboardObject = {
		tweetCount: dashboardArray[0],
		uniqueUsers: dashboardArray[1],
		uniqueHashtags: dashboardArray[2],
		hashtagsAbundance: dashboardArray[3],
	};
	res.status(200).send(dashboardObject);
});

dashboardRouter.get(dashboardRoutes.mostInfluentialTweets, async (req: Request, res: Response) => {
	const { timeRange, sortBy } = req.query;
	const influentialTweets = await mostInfluentialTweets(timeRange, sortBy);
	res.status(200).send(influentialTweets);
});