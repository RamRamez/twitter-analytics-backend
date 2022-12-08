import { matchCreator } from '../../../lib/helpers';
import ETimeRange from '../../../types/timeRange';
import Tweets from '../../../models/tweetModelV2';

export default async function uniqueHashtagsCount(
	time: ETimeRange,
	usernames?: string[],
) {
	const match = matchCreator(time, usernames);
	match['entities.hashtags'] = { $exists: true, $ne: [] };
	return Tweets.find(match)
		.distinct('entities.hashtags.tag')
		.then(hashtags => hashtags.length);
}
