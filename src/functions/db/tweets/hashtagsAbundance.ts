import dbTimeRange from '../dbTimeRange';

const Tweets = require('../../../models/tweetModelV2');

export default async function hashtagsAbundance(time, limit = 10) {
	const created_at = dbTimeRange(time);
	return Tweets.aggregate([
		{
			$match: {
				created_at,
				'entities.hashtags': { $exists: true, $not: { $size: 0 } },
			},
		},
		{ $unwind: '$entities.hashtags' },
		{ $group: { _id: '$entities.hashtags.tag', count: { $sum: 1 } } },
		{ $sort: { count: -1 } },
		{ $limit: limit },
		{ $project: { _id: 0, tag: '$_id', count: 1 } },
	]);
}
