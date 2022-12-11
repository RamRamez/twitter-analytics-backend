import { matchCreator } from '../../../lib/helpers';
import Tweets from '../../../models/tweetModelV2';
import ETimeRange from '../../../types/timeRange';
import { IHashtagAbundance } from '../../../types/api';

export default async function hashtagsAbundance(
	time: ETimeRange,
	users: string[],
	limit?: number,
): Promise<IHashtagAbundance[]> {
	const $match = matchCreator(time, users);
	$match['entities.hashtags'] = { $exists: true, $ne: [] };
	return Tweets.aggregate([
		{ $match },
		{ $unwind: '$entities.hashtags' },
		{ $group: { _id: '$entities.hashtags.tag', count: { $sum: 1 } } },
		{ $sort: { count: -1 } },
		{ $limit: limit || 10 },
		{ $project: { _id: 0, tag: '$_id', count: 1 } },
	]);
}
