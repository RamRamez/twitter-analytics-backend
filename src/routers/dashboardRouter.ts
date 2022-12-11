import { readFileSync } from 'fs';
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
import { ICountMonthly, IRetweetAvg } from '../types/api';

const dashboardRouter = Router();

dashboardRouter.get(dashboardRoutes.general, async (req: Request, res: Response) => {
	try {
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
	} catch (error) {
		handleLog(error, 'dashboardRoutes.general');
		res.status(500).send(formatResponse('Error fetching general stats'));
	}
});

dashboardRouter.get(
	dashboardRoutes.hashtagsAbundance,
	async (req: Request, res: Response) => {
		try {
			const { timeRange, users } = req.query;
			const userArray = users?.split(',');
			const hashtagsAbundanceArray = await hashtagsAbundance(timeRange, userArray);
			res.status(200).send(hashtagsAbundanceArray);
		} catch (error) {
			handleLog(error, 'dashboardRoutes.hashtagsAbundance');
			res.status(500).send(formatResponse('Error fetching hashtagsAbundance'));
		}
	},
);

dashboardRouter.get(
	dashboardRoutes.mostInfluentialTweets,
	async (req: Request, res: Response) => {
		try {
			const { timeRange, sortBy, users } = req.query;
			const userArray: string[] = users?.split(',');
			const usernames = userArray || (await getUsernames());
			const influentialTweets = await mostInfluentialTweets(
				timeRange,
				usernames,
				sortBy,
			);
			const mediaKeys = influentialTweets
				.filter(t => t.attachments)
				.map(t => t.attachments.media_keys)
				.flat();
			const media = await getMedia(mediaKeys);
			res.status(200).send({ influentialTweets, media });
		} catch (error) {
			handleLog(error, 'dashboardRoutes.mostInfluentialTweets');
			res.status(500).send(
				formatResponse('Error fetching most influential tweets'),
			);
		}
	},
);

dashboardRouter.get(
	dashboardRoutes.socialNetwork,
	async (req: Request, res: Response) => {
		try {
			const { timeRange, type, users } = req.query;
			const usernames = users?.split(',');
			const tweetIds = await referencedTweetsIds(timeRange, usernames, type);
			const socialNetwork = await findSocialNetwork(tweetIds);
			res.status(200).send(socialNetwork);
		} catch (error) {
			handleLog(error, 'dashboardRoutes.socialNetwork');
			res.status(500).send(formatResponse('Error fetching social network'));
		}
	},
);

dashboardRouter.get(dashboardRoutes.tweetsTypes, async (req: Request, res: Response) => {
	try {
		const { timeRange, users } = req.query;
		const userArray = users?.split(',');
		const types = await tweetsTypes(timeRange, userArray);
		res.status(200).send(types);
	} catch (error) {
		handleLog(error, 'dashboardRoutes.tweetsTypes');
		res.status(500).send(formatResponse('Error fetching tweets types'));
	}
});

dashboardRouter.get(
	dashboardRoutes.tweetsLanguages,
	async (req: Request, res: Response) => {
		try {
			const { timeRange, users } = req.query;
			const userArray = users?.split(',');
			const languages = await tweetsLanguages(timeRange, userArray);
			res.status(200).send(languages);
		} catch (error) {
			handleLog(error, 'dashboardRoutes.tweetsLanguages');
			res.status(500).send(formatResponse('Error fetching tweets languages'));
		}
	},
);

dashboardRouter.get(dashboardRoutes.tweetsSource, async (req: Request, res: Response) => {
	try {
		const { timeRange, users } = req.query;
		const userArray = users?.split(',');
		const source = await tweetsSource(timeRange, userArray);
		res.status(200).send(source);
	} catch (error) {
		handleLog(error, 'dashboardRoutes.tweetsSource');
		res.status(500).send(formatResponse('Error fetching tweets source'));
	}
});

dashboardRouter.get(
	dashboardRoutes.tweetsMonthly,
	async (req: Request, res: Response) => {
		try {
			const { timeRange, users } = req.query;
			const userArray = users?.split(',');
			const monthly = await tweetsMonthly(timeRange, userArray);
			res.status(200).send(monthly);
		} catch (error) {
			handleLog(error, 'dashboardRoutes.tweetsMonthly');
			res.status(500).send(formatResponse('Error fetching tweets monthly'));
		}
	},
);

dashboardRouter.get(dashboardRoutes.tweetsHourly, async (req: Request, res: Response) => {
	try {
		const { timeRange, users } = req.query;
		const userArray = users?.split(',');
		const hourly = await tweetsHourly(timeRange, userArray);
		res.status(200).send(hourly);
	} catch (error) {
		handleLog(error, 'dashboardRoutes.tweetsHourly');
		res.status(500).send(formatResponse('Error fetching tweets hourly'));
	}
});

dashboardRouter.get(dashboardRoutes.users, async (req: Request, res: Response) => {
	try {
		const users = await usersList();
		res.status(200).send(users);
	} catch (error) {
		handleLog(error, 'dashboardRoutes.users');
		res.status(500).send(formatResponse('Error fetching users'));
	}
});

dashboardRouter.get(dashboardRoutes.searchTweets, async (req: Request, res: Response) => {
	try {
		const { timeRange, users, search, tweetTypes, sortBy, fromDate, toDate } =
			req.query;
		const userArray = users?.split(',');
		const tweetTypesArray = tweetTypes?.split(',');
		const tweets = await searchTweets(
			timeRange,
			userArray,
			search,
			sortBy,
			fromDate,
			toDate,
			tweetTypesArray,
		);
		const mediaKeys = tweets
			.filter(t => t.attachments)
			.map(t => t.attachments.media_keys)
			.flat();
		const media = await getMedia(mediaKeys);
		res.status(200).send({ tweets, media });
	} catch (error) {
		handleLog(error, 'dashboardRoutes.searchTweets');
		res.status(500).send(formatResponse('Error fetching tweets'));
	}
});

dashboardRouter.get(dashboardRoutes.user, async (req: Request, res: Response) => {
	try {
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
	} catch (error) {
		handleLog(error, 'dashboardRoutes.user');
		res.status(500).send(formatResponse('Error fetching user'));
	}
});

dashboardRouter.get(dashboardRoutes.updateUsers, async (req: Request, res: Response) => {
	try {
		const { users } = req.query;
		const { last_tweet_id: lastTweetId } = await getUser(users);
		const message = await fetchFromTwitter(users, lastTweetId);
		res.status(200).send(formatResponse(message));
	} catch (error) {
		handleLog(error, 'dashboardRoutes.updateUsers');
		res.status(500).send(formatResponse('Error updating users'));
	}
});

dashboardRouter.get(dashboardRoutes.addUsers, async (req: Request, res: Response) => {
	try {
		const { users } = req.query;
		const userArray = users?.split(',');
		const dbUsers = await usersList();
		const usernameList = dbUsers.map(u => u.username.toLowerCase());
		const usersToAdd = userArray.filter(
			user => !usernameList.includes(user.toLowerCase()),
		);
		if (usersToAdd.length > 0) {
			const message = await fetchFromTwitter(usersToAdd[0]);
			return res.status(200).send(formatResponse(message));
		}
		res.status(200).send(formatResponse('No new users to add'));
	} catch (error) {
		handleLog(error, 'dashboardRoutes.addUsers');
		res.status(500).send(formatResponse('Error adding users'));
	}
});

dashboardRouter.get(userRoutes.general, async (req: Request, res: Response) => {
	try {
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
	} catch (error) {
		handleLog(error, 'userRoutes.general');
		res.status(500).send(formatResponse('Error fetching user general'));
	}
});

dashboardRouter.get(dashboardRoutes.wordsWar, async (req: Request, res: Response) => {
	try {
		const { users, search, tweetTypes, fromDate, toDate } = req.query;
		const userArray = users?.split(',');
		const tweetTypesArray = tweetTypes?.split(',');
		const searchArray = search?.split(',');
		const promises: Promise<ICountMonthly[]>[] = searchArray?.map(s =>
			wordsWar(userArray, s, fromDate, toDate, tweetTypesArray),
		);
		const wordsWarArray = await Promise.all(promises);
		const result = wordsWarArray.map((w, i) => ({
			word: searchArray[i],
			wordsWar: w,
		}));
		res.status(200).send(result);
	} catch (error) {
		handleLog(error, 'dashboardRoutes.wordsWar');
		res.status(500).send(formatResponse('Error fetching words war'));
	}
});

dashboardRouter.get(dashboardRoutes.wordCloud, async (req: Request, res: Response) => {
	try {
		const { users, search, tweetTypes, fromDate, toDate } = req.query;
		const userArray = users?.split(',');
		const tweetTypesArray = tweetTypes?.split(',');
		const cloud = await wordCloud(
			userArray,
			search,
			fromDate,
			toDate,
			tweetTypesArray,
		);
		res.status(200).send(cloud);
	} catch (error) {
		handleLog(error, 'dashboardRoutes.wordCloud');
		res.status(500).send(formatResponse('Error fetching word cloud'));
	}
});

dashboardRouter.get(
	dashboardRoutes.wordsInfluence,
	async (req: Request, res: Response) => {
		try {
			const { users, search, tweetTypes, fromDate, toDate } = req.query;
			const userArray = users?.split(',');
			const tweetTypesArray = tweetTypes?.split(',');
			const searchArray = search?.split(',');
			const promises: Promise<IRetweetAvg[]>[] = searchArray?.map(s =>
				retweetAvgMonthly(userArray, s, fromDate, toDate, tweetTypesArray),
			);
			const wordsInfluenceArray = await Promise.all(promises);
			const result = wordsInfluenceArray.map((w, i) => ({
				word: searchArray[i],
				wordsInfluence: w,
			}));
			res.status(200).send(result);
		} catch (error) {
			handleLog(error, 'dashboardRoutes.wordsInfluence');
			res.status(500).send(formatResponse('Error fetching words influence'));
		}
	},
);

dashboardRouter.get(
	dashboardRoutes.profilesInfluence,
	async (req: Request, res: Response) => {
		try {
			const { users, search, tweetTypes, fromDate, toDate } = req.query;
			const userArray = users?.split(',');
			const tweetTypesArray = tweetTypes?.split(',');
			const promises: Promise<IRetweetAvg[]>[] = userArray?.map(user =>
				retweetAvgMonthly([user], search, fromDate, toDate, tweetTypesArray),
			);
			const profilesArray = await Promise.all(promises);
			const result = profilesArray.map((p, i) => ({
				profile: userArray[i],
				profilesInfluence: p,
			}));
			res.status(200).send(result);
		} catch (error) {
			handleLog(error, 'dashboardRoutes.profilesInfluence');
			res.status(500).send(formatResponse('Error fetching profiles influence'));
		}
	},
);

dashboardRouter.get(dashboardRoutes.logs, async (req: Request, res: Response) => {
	try {
		const logs = readFileSync(global.logFile, 'utf8');
		res.status(200).send({ logs });
	} catch (error) {
		handleLog(error, 'dashboardRoutes.logs');
		res.status(500).send(formatResponse('Error getting logs'));
	}
});

export default dashboardRouter;
