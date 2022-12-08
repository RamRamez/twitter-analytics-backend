import { matchCreator } from '../../../lib/helpers';
import Tweets from '../../../models/tweetModelV2';

export default async function tweetsLanguages(time, usernames) {
	const $match = matchCreator(time, usernames);
	return Tweets.aggregate([
		{ $match },
		{ $group: { _id: '$lang', count: { $sum: 1 } } },
		{ $sort: { count: -1 } },
		{ $project: { _id: 0, lang: '$_id', count: 1 } },
	]);
}
