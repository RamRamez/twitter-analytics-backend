import { matchCreator } from '../../../lib/helpers';
import Tweets from '../../../models/tweetModelV2';
import ETimeRange from '../../../types/timeRange';
import { ITweetsSource } from '../../../types/api';

export default async function tweetsSource(
	time: ETimeRange,
	usernames: string[],
): Promise<ITweetsSource[]> {
	const $match = matchCreator(time, usernames);
	return Tweets.aggregate([
		{ $match },
		{ $group: { _id: '$source', count: { $sum: 1 } } },
		{ $sort: { count: -1 } },
		{ $project: { _id: 0, source: '$_id', count: 1 } },
	]);
}
