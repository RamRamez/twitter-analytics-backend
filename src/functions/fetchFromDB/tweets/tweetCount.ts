import { matchCreator } from '../../../lib/helpers';
import ETimeRange from '../../../types/timeRange';
import Tweets from '../../../models/tweetModelV2';

export default async function tweetCount(
	time: ETimeRange,
	usernames?: string[],
): Promise<number> {
	const match = matchCreator(time, usernames);
	return Tweets.countDocuments(match);
}
