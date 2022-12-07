import { ETimeRange } from '../types/timeRange';
import { ESortByDate } from '../types/sortBy';
import { EPublicMetrics } from '../types/publicMetrics';
import { TTweetOnly, TTweetTypes } from '../types/referencedTweetsType';
import { ITweet } from '../types/tweet';
import { IUserSimple } from '../types/user';
import { fetchUserByName } from '../functions/fetchFromTwitter/fetchUserByName';
import { updateUser } from '../functions/saveToDB/updateUser';
import { insertTweets } from '../functions/saveToDB/insertTweets';
import { fetchUserTweetsById } from '../functions/fetchFromTwitter/fetchUserTweetsById';

const fs = require('fs');

export function formatResponse(message: string) {
	return { message };
}

export function dbTimeRange(time: ETimeRange) {
	const d = new Date();
	if (time === 'week') {
		d.setDate(d.getDate() - 7);
	} else if (time === 'month') {
		d.setDate(d.getDate() - 30);
	} else if (time === '3month') {
		d.setDate(d.getDate() - 90);
	} else if (time === 'halfYear') {
		d.setDate(d.getDate() - 180);
	} else if (time === 'year') {
		d.setDate(d.getDate() - 365);
	} else {
		return { $exists: true };
	}
	return { $gte: new Date(d) };
}

export function matchCreator(
	time?: ETimeRange,
	users?: string[],
	search?: string,
	fromDate?: string,
	toDate?: string,
	tweetTypes?: TTweetTypes[],
) {
	const match: any = {};
	if (time && time !== ETimeRange.all) {
		match.created_at = dbTimeRange(time);
	}
	if (users?.length > 0) {
		match['author.username'] = { $in: users };
	}
	if (search) {
		match.$text = { $search: search };
	}
	if (fromDate) {
		if (!match.created_at) {
			match.created_at = {};
		}
		match.created_at.$gte = new Date(fromDate);
	}
	if (toDate) {
		if (!match.created_at) {
			match.created_at = {};
		}
		match.created_at.$lte = new Date(toDate);
	}
	if (tweetTypes?.length > 0) {
		if (tweetTypes.length === 1) {
			if (tweetTypes.includes(TTweetOnly.tweet)) {
				match.referenced_tweets = { $size: 0 };
			} else {
				match['referenced_tweets.type'] = tweetTypes[0];
			}
		} else {
			match.$or = [];
			match.$or.push({ 'referenced_tweets.type': { $in: tweetTypes } });
			if (tweetTypes.includes(TTweetOnly.tweet)) {
				match.$or.push({ referenced_tweets: { $size: 0 } });
			}
		}
	}
	return match;
}

export function sortByCreator(sortBy?: ESortByDate | EPublicMetrics) {
	const sort: any = {};
	if (Object.values(EPublicMetrics).includes(sortBy as EPublicMetrics)) {
		sort[`public_metrics.${sortBy}`] = -1;
	} else if (sortBy === ESortByDate.newest) {
		sort.created_at = -1;
	} else if (sortBy === ESortByDate.oldest) {
		sort.created_at = 1;
	}
	return sort;
}

export function addAuthorsToTweets(tweets: ITweet[], users: IUserSimple[]) {
	return tweets.map(tweet => {
		const author = users.find(user => user.id === tweet.author_id);
		if (author) {
			const { name, username, id, profile_image_url } = author;
			tweet.author = { name, profile_image_url, username, id };
		}
		return tweet;
	});
}

export const fetchFromTwitter = async (
	user: string,
	lastTweetId?: string,
): Promise<string> => {
	try {
		const { data: userData, includes } = await fetchUserByName(user);
		await updateUser(userData);
		if (includes) {
			const includeTweets = addAuthorsToTweets(includes.tweets, [userData]);
			await insertTweets(includeTweets);
		}
		const newLastTweetId = await fetchUserTweetsById(userData.id, lastTweetId);
		if (!newLastTweetId) {
			handleLog(`${user} has no new tweets`);
			return `${user} has no new tweets`;
		}
		await updateUser({ id: userData.id, last_tweet_id: newLastTweetId });
		handleLog(`${user} tweets ${lastTweetId ? 'updated' : 'added'}`);
		return `${user} tweets ${lastTweetId ? 'updated' : 'added'}`;
	} catch (error) {
		const tag = error.tag || 'fetchFromTwitter';
		!error.tag && handleLog(error, tag);
		throw { ...error, tag };
	}
};

export const handleLog = (str: any, errorTag?: string) => {
	errorTag && console.log({ error: str, errorCode: errorTag });
	const oldData = fs.readFileSync(__dirname + '/../../log.txt');
	const fd = fs.openSync(__dirname + '/../../log.txt', 'w+');
	const log = `Date: ${new Date().toLocaleString()}\nLog: ${str} ${
		errorTag ? `\nError code: ${errorTag}` : ''
	}\n\n`;
	const buffer = Buffer.from(log);
	fs.writeSync(fd, buffer, 0, buffer.length, 0); //write new data
	fs.writeSync(fd, oldData, 0, oldData.length, buffer.length); //append old data
	fs.close(fd);
};
