import dbTimeRange from '../dbTimeRange';

const Tweets = require('../../../models/tweetModelV2');

export default async function tweetsSource(time) {
	const created_at = dbTimeRange(time);
	return  Tweets.aggregate([
		{ $match: { created_at } },
		{ $group: { _id: '$source', count: { $sum: 1 } } },
		{ $sort: { count: -1 } },
		{ $project: { _id: 0, source: '$_id', count: 1 } },
	]);
}
