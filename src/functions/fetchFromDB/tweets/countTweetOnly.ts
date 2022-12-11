import { dbTimeRange } from '../../../lib/helpers';
import Tweets from '../../../models/tweetModelV2';

export default async function countTweetOnly(time): Promise<number> {
	const created_at = dbTimeRange(time);
	return Tweets.countDocuments({
		created_at,
		referenced_tweets: { $size: 0 },
	});
}
