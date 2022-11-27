import { matchCreator } from '../../../lib/helpers';

const Tweets = require('../../../models/tweetModelV2');

export default async function hashtagsAbundance(time, users, limit = 10) {
	const $match = matchCreator(time, users);
	$match['entities.hashtags'] = { $exists: true, $ne: [] };
	return Tweets.aggregate([
		{ $match },
		{ $unwind: '$entities.hashtags' },
		{ $group: { _id: '$entities.hashtags.tag', count: { $sum: 1 } } },
		{ $sort: { count: -1 } },
		{ $limit: limit },
		{ $project: { _id: 0, tag: '$_id', count: 1 } },
	]);
}
