import countTweetOnly from './countTweetOnly';
import { matchCreator } from '../../../lib/helpers';
import Tweets from '../../../models/tweetModelV2';

export default async function tweetsTypes(time, usernames) {
	const $match = matchCreator(time, usernames);
	const tweetOnly = await countTweetOnly(time);
	const referenced = await Tweets.aggregate([
		{ $match },
		{ $unwind: '$referenced_tweets' },
		{ $group: { _id: '$referenced_tweets.type', count: { $sum: 1 } } },
		{ $project: { _id: 0, type: '$_id', count: 1 } },
	]);
	referenced.push({ count: tweetOnly, type: 'tweet' });
	return referenced;
}
