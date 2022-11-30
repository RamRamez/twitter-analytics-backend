import { EPublicMetrics } from '../../../types/publicMetrics';
import { EReferencedTweetsType, TTweetOnly } from '../../../types/referencedTweetsType';
import { ITweet } from '../../../types/tweet';
import { matchCreator, sortByCreator } from '../../../lib/helpers';

const Tweets = require('../../../models/tweetModelV2');

export default async function mostInfluentialTweets(
	time,
	type = EPublicMetrics.retweet_count,
	usernames,
	limit = 10,
): Promise<ITweet[]> {
	const tweetTypes = [EReferencedTweetsType.replied_to, EReferencedTweetsType.quoted, TTweetOnly.tweet];
	const $match = matchCreator(time, usernames, undefined, undefined, undefined, tweetTypes);
	const $sort = sortByCreator(type);
	return Tweets.aggregate([{ $match }, { $sort }, { $limit: limit }]);
}
