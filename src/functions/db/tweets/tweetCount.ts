import dbTimeRange from '../dbTimeRange';

const Tweets = require('../../../models/tweetModelV2');

export default async function tweetCount(time) {
	const created_at = dbTimeRange(time);
	return Tweets.countDocuments({ created_at });
}
