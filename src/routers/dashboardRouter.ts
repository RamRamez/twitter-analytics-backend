import { Request, Response, Router } from 'express';
import { dashboardRoutes } from '../routes';
import tweetCount from '../functions/db/tweets/tweetCount';
import usersCount from '../functions/db/users/usersCount';
import uniqueHashtagsCount from '../functions/db/tweets/uniqueHashtagsCount';
import hashtagsAbundance from '../functions/db/tweets/hashtagsAbundance';
import mostInfluentialTweets from '../functions/db/tweets/mostInfluentialTweets';
import getMedia from '../functions/db/media/getMedia';
import getUsernames from '../functions/db/users/getUsernames';
import referencedTweetsIds from '../functions/db/tweets/referencedTweetsIds';
import findSocialNetwork from '../functions/db/tweets/findSocialNetwork';
import tweetsTypes from '../functions/db/tweets/tweetsTypes';
import tweetsLanguages from '../functions/db/tweets/tweetsLanguages';
import tweetsMonthly from '../functions/db/tweets/tweetsMonthly';
import tweetsHourly from '../functions/db/tweets/tweetsHourly';
import tweetsSource from '../functions/db/tweets/tweetsSource';
import usersList from '../functions/db/users/usersList';

export const dashboardRouter = Router();

dashboardRouter.get(dashboardRoutes.general, async (req: Request, res: Response) => {
	const { timeRange } = req.query;
	const dashboardArray = await Promise.all([
		tweetCount(timeRange),
		usersCount(),
		uniqueHashtagsCount(timeRange),
	]);
	const dashboardObject = {
		tweetCount: dashboardArray[0],
		uniqueUsers: dashboardArray[1],
		uniqueHashtags: dashboardArray[2],
	};
	res.status(200).send(dashboardObject);
});

dashboardRouter.get(dashboardRoutes.hashtagsAbundance, async (req: Request, res: Response) => {
	const { timeRange, users } = req.query;
	const userArray = users?.split(',');
	const hashtagsAbundanceArray = await hashtagsAbundance(timeRange, userArray);
	res.status(200).send(hashtagsAbundanceArray);
});

dashboardRouter.get(
	dashboardRoutes.mostInfluentialTweets,
	async (req: Request, res: Response) => {
		const { timeRange, sortBy, users } = req.query;
		const userArray = users?.split(',');
		const usernames = userArray || await getUsernames();
		const influentialTweets = await mostInfluentialTweets(timeRange, sortBy, usernames);
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
		const { timeRange, type, users } = req.query;
		const userArray = users?.split(',');
		const referencedIds = await referencedTweetsIds(timeRange, type, userArray);
		const socialNetwork = await findSocialNetwork(referencedIds);
		res.status(200).send(socialNetwork);
	},
);

dashboardRouter.get(dashboardRoutes.tweetsTypes, async (req: Request, res: Response) => {
	const { timeRange, users } = req.query;
	const userArray = users?.split(',');
	const types = await tweetsTypes(timeRange, userArray);
	res.status(200).send(types);
});

dashboardRouter.get(dashboardRoutes.tweetsLanguages, async (req: Request, res: Response) => {
	const { timeRange, users } = req.query;
	const userArray = users?.split(',');
	const languages = await tweetsLanguages(timeRange, userArray);
	res.status(200).send(languages);
})

dashboardRouter.get(dashboardRoutes.tweetsSource, async (req: Request, res: Response) => {
	const { timeRange, users } = req.query;
	const userArray = users?.split(',');
	const source = await tweetsSource(timeRange, userArray);
	res.status(200).send(source);
})

dashboardRouter.get(dashboardRoutes.tweetsMonthly, async (req: Request, res: Response) => {
	const { timeRange, users } = req.query;
	const userArray = users?.split(',');
	const monthly = await tweetsMonthly(timeRange, userArray);
	res.status(200).send(monthly);
})

dashboardRouter.get(dashboardRoutes.tweetsHourly, async (req: Request, res: Response) => {
	const { timeRange, users } = req.query;
	const userArray = users?.split(',');
	const hourly = await tweetsHourly(timeRange, userArray);
	res.status(200).send(hourly);
})

dashboardRouter.get(dashboardRoutes.users, async (req: Request, res: Response) => {
	const users = await usersList();
	res.status(200).send(users);
})