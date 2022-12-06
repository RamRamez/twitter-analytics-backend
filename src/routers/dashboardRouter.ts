import { Request, Response, Router } from 'express';
import { dashboardRoutes, userRoutes } from '../routes';
import tweetCount from '../functions/fetchFromDB/tweets/tweetCount';
import usersCount from '../functions/fetchFromDB/users/usersCount';
import uniqueHashtagsCount from '../functions/fetchFromDB/tweets/uniqueHashtagsCount';
import hashtagsAbundance from '../functions/fetchFromDB/tweets/hashtagsAbundance';
import mostInfluentialTweets from '../functions/fetchFromDB/tweets/mostInfluentialTweets';
import getMedia from '../functions/fetchFromDB/media/getMedia';
import getUsernames from '../functions/fetchFromDB/users/getUsernames';
import referencedTweetsIds from '../functions/fetchFromDB/tweets/referencedTweetsIds';
import findSocialNetwork from '../functions/fetchFromDB/tweets/findSocialNetwork';
import tweetsTypes from '../functions/fetchFromDB/tweets/tweetsTypes';
import tweetsLanguages from '../functions/fetchFromDB/tweets/tweetsLanguages';
import tweetsMonthly from '../functions/fetchFromDB/tweets/tweetsMonthly';
import tweetsHourly from '../functions/fetchFromDB/tweets/tweetsHourly';
import tweetsSource from '../functions/fetchFromDB/tweets/tweetsSource';
import usersList from '../functions/fetchFromDB/users/usersList';
import getUser from '../functions/fetchFromDB/users/getUser';
import getTweet from '../functions/fetchFromDB/tweets/getTweet';
import publicMetricsAverage from '../functions/fetchFromDB/tweets/publicMetricsAverage';
import searchTweets from '../functions/fetchFromDB/tweets/searchTweets';
import wordsWar from '../functions/fetchFromDB/tweets/wordsWar';
import wordCloud from '../functions/fetchFromDB/tweets/wordCloud';
import retweetAvgMonthly from '../functions/fetchFromDB/tweets/retweetAvgMonthly';
import { fetchFromTwitter, formatResponse, handleLog } from '../lib/helpers';

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

dashboardRouter.get(
	dashboardRoutes.hashtagsAbundance,
	async (req: Request, res: Response) => {
		const { timeRange, users } = req.query;
		const userArray = users?.split(',');
		const hashtagsAbundanceArray = await hashtagsAbundance(timeRange, userArray);
		res.status(200).send(hashtagsAbundanceArray);
	},
);

dashboardRouter.get(
	dashboardRoutes.mostInfluentialTweets,
	async (req: Request, res: Response) => {
		const { timeRange, sortBy, users } = req.query;
		const userArray = users?.split(',');
		const usernames = userArray || (await getUsernames());
		const influentialTweets = await mostInfluentialTweets(
			timeRange,
			sortBy,
			usernames,
		);
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

dashboardRouter.get(
	dashboardRoutes.tweetsLanguages,
	async (req: Request, res: Response) => {
		const { timeRange, users } = req.query;
		const userArray = users?.split(',');
		const languages = await tweetsLanguages(timeRange, userArray);
		res.status(200).send(languages);
	},
);

dashboardRouter.get(dashboardRoutes.tweetsSource, async (req: Request, res: Response) => {
	const { timeRange, users } = req.query;
	const userArray = users?.split(',');
	const source = await tweetsSource(timeRange, userArray);
	res.status(200).send(source);
});

dashboardRouter.get(
	dashboardRoutes.tweetsMonthly,
	async (req: Request, res: Response) => {
		const { timeRange, users } = req.query;
		const userArray = users?.split(',');
		const monthly = await tweetsMonthly(timeRange, userArray);
		res.status(200).send(monthly);
	},
);

dashboardRouter.get(dashboardRoutes.tweetsHourly, async (req: Request, res: Response) => {
	const { timeRange, users } = req.query;
	const userArray = users?.split(',');
	const hourly = await tweetsHourly(timeRange, userArray);
	res.status(200).send(hourly);
});

dashboardRouter.get(dashboardRoutes.users, async (req: Request, res: Response) => {
	const users = await usersList();
	res.status(200).send(users);
});

dashboardRouter.get(dashboardRoutes.searchTweets, async (req: Request, res: Response) => {
	const { timeRange, users, search, tweetTypes, sortBy, fromDate, toDate } = req.query;
	const userArray = users?.split(',');
	const tweetTypesArray = tweetTypes?.split(',');
	const tweets = await searchTweets(timeRange, userArray, search, sortBy, fromDate, toDate, tweetTypesArray);
	const mediaKeys = tweets
		.filter(t => t.attachments)
		.map(t => t.attachments.media_keys)
		.flat();
	const media = await getMedia(mediaKeys);
	res.status(200).send({ tweets, media });
});

dashboardRouter.get(dashboardRoutes.user, async (req: Request, res: Response) => {
	const { username } = req.params;
	const user = await getUser(username);
	if (user.pinned_tweet_id) {
		const pinnedTweet = await getTweet(user.pinned_tweet_id);
		const mediaKeys = pinnedTweet?.attachments?.media_keys;
		if (mediaKeys) {
			const media = await getMedia(mediaKeys);
			res.status(200).send({ user, pinnedTweet, media });
		} else {
			res.status(200).send({ user, pinnedTweet });
		}
	} else res.status(200).send({ user });
});

dashboardRouter.get(dashboardRoutes.updateUsers, async (req: Request, res: Response) => {
	try {
		const { users } = req.query;
		const { last_tweet_id: lastTweetId } = await getUser(users);
		const message = await fetchFromTwitter(users, lastTweetId);
		res.status(200).send(formatResponse(message));
	} catch (error) {
		!error.tag && handleLog(error, 'dashboardRoutes.updateUsers');
		res.status(500).send(formatResponse('Error updating users'));
	}
})

dashboardRouter.get(dashboardRoutes.addUsers, async (req: Request, res: Response) => {
	try {
		const { users } = req.query;
		const userArray = users?.split(',');
		const dbUsers = await usersList();
		const usernameList = dbUsers.map(u => u.username.toLowerCase());
		const usersToAdd = userArray.filter(user => !usernameList.includes(user.toLowerCase()));
		if (usersToAdd.length > 0) {
			const message = await fetchFromTwitter(usersToAdd[0]);
			return res.status(200).send(formatResponse(message));
		}
		res.status(200).send(formatResponse('No new users to add'));
	} catch (error) {
		!error.tag && handleLog(error, 'dashboardRoutes.addUsers');
		res.status(500).send(formatResponse('Error adding users'));
	}
})

dashboardRouter.get(userRoutes.general, async (req: Request, res: Response) => {
	const { username } = req.params;
	const { timeRange } = req.query;
	const dashboardArray = await Promise.all([
		tweetCount(timeRange, [username]),
		uniqueHashtagsCount(timeRange, [username]),
		publicMetricsAverage(timeRange, [username]),
	]);
	const dashboardObject = {
		tweetCount: dashboardArray[0],
		uniqueHashtagsCount: dashboardArray[1],
		publicMetricsAverage: dashboardArray[2],
	};
	res.status(200).send(dashboardObject);
});

dashboardRouter.get(dashboardRoutes.wordsWar, async (req: Request, res: Response) => {
	const { users, search, tweetTypes, fromDate, toDate } = req.query;
	const userArray = users?.split(',');
	const tweetTypesArray = tweetTypes?.split(',');
	const searchArray = search?.split(',');
	const promises = searchArray?.map(s => wordsWar(userArray, s, fromDate, toDate, tweetTypesArray));
	const wordsWarArray = await Promise.all(promises);
	const result = wordsWarArray.map((w, i) => ({ word: searchArray[i], wordsWar: w }));
	res.status(200).send(result);
})

dashboardRouter.get(dashboardRoutes.wordCloud, async (req: Request, res: Response) => {
	const { users, search, tweetTypes, fromDate, toDate } = req.query;
	const userArray = users?.split(',');
	const tweetTypesArray = tweetTypes?.split(',');
	const cloud = await wordCloud(userArray, search, fromDate, toDate, tweetTypesArray);
	res.status(200).send(cloud);
})

dashboardRouter.get(dashboardRoutes.wordsInfluence, async (req: Request, res: Response) => {
	const { users, search, tweetTypes, fromDate, toDate } = req.query;
	const userArray = users?.split(',');
	const tweetTypesArray = tweetTypes?.split(',');
	const searchArray = search?.split(',');
	const promises = searchArray?.map(s => retweetAvgMonthly(userArray, s, fromDate, toDate, tweetTypesArray));
	const wordsInfluenceArray = await Promise.all(promises);
	const result = wordsInfluenceArray.map((w, i) => ({ word: searchArray[i], wordsInfluence: w }));
	res.status(200).send(result);
})

dashboardRouter.get(dashboardRoutes.profilesInfluence, async (req: Request, res: Response) => {
	const { users, search, tweetTypes, fromDate, toDate } = req.query;
	const userArray = users?.split(',');
	const tweetTypesArray = tweetTypes?.split(',');
	const promises = userArray?.map(user => retweetAvgMonthly([user], search, fromDate, toDate, tweetTypesArray));
	const profilesArray = await Promise.all(promises);
	const result = profilesArray.map((p, i) => ({ profile: userArray[i], profilesInfluence: p }));
	res.status(200).send(result);
})