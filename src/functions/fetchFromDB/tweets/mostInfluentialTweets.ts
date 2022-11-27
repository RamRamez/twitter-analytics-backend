import { EPublicMetrics } from '../../../types/publicMetrics';
import { EReferencedTweetsType } from '../../../types/referencedTweetsType';
import { ITweet } from '../../../types/tweet';
import { matchCreator } from '../../../lib/helpers';

const Tweets = require('../../../models/tweetModelV2');

export default async function mostInfluentialTweets(
	time,
	type = EPublicMetrics.retweet_count,
	usernames,
	limit = 10,
): Promise<ITweet[]> {
	const $match = matchCreator(time, usernames);
	$match['$or'] = [
		{ referenced_tweets: { $size: 0 } },
		{
			'referenced_tweets.type': {
				$in: [
					EReferencedTweetsType.replied_to,
					EReferencedTweetsType.quoted,
				],
			},
		},
	]
	const sortBy = `public_metrics.${type}`;
	return Tweets.aggregate([
		{ $match },
		{ $sort: { [sortBy]: -1 } },
		{ $limit: limit },
	]);
}
