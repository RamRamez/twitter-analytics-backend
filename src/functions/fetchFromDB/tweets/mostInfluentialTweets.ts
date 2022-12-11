import { EReferencedTweetsType, TTweetOnly } from '../../../types/referencedTweetsType';
import { ITweet } from '../../../types/tweet';
import { matchCreator, sortByCreator } from '../../../lib/helpers';
import Tweets from '../../../models/tweetModelV2';
import EPublicMetrics from '../../../types/publicMetrics';
import ETimeRange from '../../../types/timeRange';

export default async function mostInfluentialTweets(
	time: ETimeRange,
	usernames: string[],
	type?: EPublicMetrics,
	limit?: number,
): Promise<ITweet[]> {
	const tweetTypes = [
		EReferencedTweetsType.replied_to,
		EReferencedTweetsType.quoted,
		TTweetOnly.tweet,
	];
	const $match = matchCreator(
		time,
		usernames,
		undefined,
		undefined,
		undefined,
		tweetTypes,
	);
	const $sort = sortByCreator(type || EPublicMetrics.retweet_count);
	return Tweets.aggregate([{ $match }, { $sort }, { $limit: limit || 10 }]);
}
