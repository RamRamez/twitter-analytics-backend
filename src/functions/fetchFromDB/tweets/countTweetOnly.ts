import { dbTimeRange } from '../../../lib/helpers';

const Tweets = require('../../../models/tweetModelV2');

export default async function countTweetOnly(time) {
	const created_at = dbTimeRange(time);
	return Tweets.countDocuments({
		created_at,
		referenced_tweets: { $size: 0 },
	});
}
