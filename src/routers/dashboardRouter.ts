import { Request, Response, Router } from 'express';
import { dashboardRoutes } from '../routes';
import tweetCount from '../functions/db/tweets/tweetCount';
import uniqueUsers from '../functions/db/users/uniqueUsers';
import uniqueHashtagsCount from '../functions/db/tweets/uniqueHashtagsCount';
import hashtagsAbundance from '../functions/db/tweets/hashtagsAbundance';
import mostInfluentialTweets from '../functions/db/tweets/mostInfluentialTweets';
import getMedia from '../functions/db/media/getMedia';
import userIds from '../functions/db/users/userIds';
import referencedTweetsIds from '../functions/db/tweets/referencedTweetsIds';
import findSocialNetwork from '../functions/db/tweets/findSocialNetwork';
import tweetsTypes from '../functions/db/tweets/tweetsTypes';
import tweetsLanguages from '../functions/db/tweets/tweetsLanguages';
import tweetsTimeRange from '../functions/db/tweets/tweetsTimeRange';

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

dashboardRouter.get(
	dashboardRoutes.mostInfluentialTweets,
	async (req: Request, res: Response) => {
		const { timeRange, sortBy } = req.query;
		const userIDs = await userIds();
		const influentialTweets = await mostInfluentialTweets(timeRange, sortBy, userIDs);
		const mediaKeys = influentialTweets
			.filter(t => t.attachments)
			.map(t => t.attachments.media_keys)
			.flat();
		const media = await getMedia(mediaKeys);
		res.status(200).send({ influentialTweets, media });
	},
);

dashboardRouter.get(
	dashboardRoutes.socialNetwork,
	async (req: Request, res: Response) => {
		const { timeRange, type } = req.query;
		const referencedIds = await referencedTweetsIds(timeRange, type);
		const socialNetwork = await findSocialNetwork(referencedIds);
		res.status(200).send(socialNetwork);
	},
);

dashboardRouter.get(dashboardRoutes.tweetsTypes, async (req: Request, res: Response) => {
	const { timeRange } = req.query;
	const types = await tweetsTypes(timeRange);
	res.status(200).send(types);
});

dashboardRouter.get(dashboardRoutes.tweetsLanguages, async (req: Request, res: Response) => {
	const { timeRange } = req.query;
	const languages = await tweetsLanguages(timeRange);
	res.status(200).send(languages);
})

dashboardRouter.get(dashboardRoutes.tweetsTimeRange, async (req: Request, res: Response) => {
	const { timeRange } = req.query;
	const count = await tweetsTimeRange(timeRange);
	res.status(200).send({ count });
})
