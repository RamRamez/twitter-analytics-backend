import dbTimeRange from '../dbTimeRange';
import countTweetOnly from './countTweetOnly';

const Tweets = require('../../../models/tweetModelV2');

export default async function tweetsTypes(time) {
	const created_at = dbTimeRange(time);
	const tweetOnly = await countTweetOnly(time);
	const referenced = await Tweets.aggregate([
		{ $match: { created_at } },
		{ $unwind: '$referenced_tweets' },
		{ $group: { _id: '$referenced_tweets.type', count: { $sum: 1 } } },
		{ $project: { _id: 0, type: '$_id', count: 1 } },
	]);
	referenced.push({ count: tweetOnly, type: 'tweet' });
	return referenced;
}
