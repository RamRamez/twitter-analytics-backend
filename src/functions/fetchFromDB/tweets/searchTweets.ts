import ETimeRange from '../../../types/timeRange';
import { matchCreator, sortByCreator } from '../../../lib/helpers';
import { TTweetTypes } from '../../../types/referencedTweetsType';
import Tweets from '../../../models/tweetModelV2';
import { ITweet } from '../../../types/tweet';
import EPublicMetrics from '../../../types/publicMetrics';
import { ESortByDate } from '../../../types/sortBy';

export default async function searchTweets(
	time: ETimeRange,
	usernames?: string[],
	search?: string,
	sortBy?: ESortByDate | EPublicMetrics,
	fromDate?: string,
	toDate?: string,
	tweetTypes?: TTweetTypes[],
	limit?: number,
): Promise<ITweet[]> {
	const match = matchCreator(time, usernames, search, fromDate, toDate, tweetTypes);
	const sort = sortByCreator(sortBy);
	return Tweets.find(match)
		.sort(sort)
		.limit(limit || 20) as unknown as ITweet[];
}
