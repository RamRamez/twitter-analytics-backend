import dbTimeRange from '../dbTimeRange';
import { EPublicMetrics } from '../../../types/publicMetrics';
import { EReferencedTweetsType } from '../../../types/referencedTweetsType';
import { ITweet } from '../../../types/tweet';

const Tweets = require('../../../models/tweetModelV2');

export default async function mostInfluentialTweets(
	time,
	type = EPublicMetrics.retweet_count,
	limit = 10,
): Promise<ITweet[]> {
	const created_at = dbTimeRange(time);
	const sortBy = `public_metrics.${type}`;
	return Tweets.aggregate([
		{
			$match: {
				created_at,
				$or: [
					{ referenced_tweets: { $size: 0 } },
					{
						'referenced_tweets.type': {
							$ne: EReferencedTweetsType.retweeted,
						},
					},
				],
			},
		},
		{ $sort: { [sortBy]: -1 } },
		{ $limit: limit },
	]);
}
