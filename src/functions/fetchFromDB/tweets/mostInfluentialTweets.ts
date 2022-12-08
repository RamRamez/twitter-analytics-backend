import { EReferencedTweetsType, TTweetOnly } from '../../../types/referencedTweetsType';
import { ITweet } from '../../../types/tweet';
import { matchCreator, sortByCreator } from '../../../lib/helpers';
import Tweets from '../../../models/tweetModelV2';
import EPublicMetrics from '../../../types/publicMetrics';

export default async function mostInfluentialTweets(
	time,
	type = EPublicMetrics.retweet_count,
	usernames,
	limit = 10,
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
	const $sort = sortByCreator(type);
	return Tweets.aggregate([{ $match }, { $sort }, { $limit: limit }]);
}
