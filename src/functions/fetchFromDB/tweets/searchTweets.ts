import { ETimeRange } from '../../../types/timeRange';
import { matchCreator, sortByCreator } from '../../../lib/helpers';
import { ESortByDate } from '../../../types/sortBy';
import { EPublicMetrics } from '../../../types/publicMetrics';
import { TTweetTypes } from '../../../types/referencedTweetsType';
import { ITweet } from '../../../types/tweet';

const Tweets = require('../../../models/tweetModelV2');

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
	return Tweets.find(match).sort(sort).limit(limit || 20);
}
