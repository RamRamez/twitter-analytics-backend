import { dbTimeRange } from '../../../lib/helpers';

const Tweets = require('../../../models/tweetModelV2');

export default async function uniqueHashtagsCount(time) {
	const created_at = dbTimeRange(time);
	return Tweets.find({
		created_at,
		'entities.hashtags': { $exists: true, $not: { $size: 0 } },
	})
		.distinct('entities.hashtags.tag')
		.then(hashtags => hashtags.length);
}
