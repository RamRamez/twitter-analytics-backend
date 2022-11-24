import dbTimeRange from '../dbTimeRange';

const Tweets = require('../../../models/tweetModelV2');

export default async function tweetsLanguages(time) {
	const created_at = dbTimeRange(time);
	return  Tweets.aggregate([
		{ $match: { created_at } },
		{ $group: { _id: '$lang', count: { $sum: 1 } } },
		{ $project: { _id: 0, lang: '$_id', count: 1 } },
	]);
}
