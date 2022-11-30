import { matchCreator } from '../../../lib/helpers';

const Tweets = require('../../../models/tweetModelV2');

export default async function tweetsSource(time, usernames) {
	const $match = matchCreator(time, usernames);
	return Tweets.aggregate([
		{ $match },
		{ $group: { _id: '$source', count: { $sum: 1 } } },
		{ $sort: { count: -1 } },
		{ $project: { _id: 0, source: '$_id', count: 1 } },
	]);
}
