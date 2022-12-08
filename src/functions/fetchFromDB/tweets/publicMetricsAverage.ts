import { matchCreator } from '../../../lib/helpers';
import ETimeRange from '../../../types/timeRange';
import Tweets from '../../../models/tweetModelV2';

export default async function publicMetricsAverage(
	time?: ETimeRange,
	usernames?: string[],
) {
	const $match = matchCreator(time, usernames);
	$match.public_metrics = { $exists: true };
	return Tweets.aggregate([
		{ $match },
		{
			$group: {
				_id: null,
				retweetAvg: { $avg: '$public_metrics.retweet_count' },
				replyAvg: { $avg: '$public_metrics.reply_count' },
				likeAvg: { $avg: '$public_metrics.like_count' },
				quoteAvg: { $avg: '$public_metrics.quote_count' },
			},
		},
		{ $project: { _id: 0 } },
	]).then(res => res[0]);
}
