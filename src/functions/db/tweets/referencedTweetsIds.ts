import dbTimeRange from '../dbTimeRange';
import { EReferencedTweetsType } from '../../../types/referencedTweetsType';

const Tweets = require('../../../models/tweetModelV2');

export default async function referencedTweetsIds(time, type = EReferencedTweetsType.retweeted) {
	const created_at = dbTimeRange(time);
	// TODO: a tweet maybe referenced by multiple tweets. It affects social network analysis.
	const objArray = await Tweets.aggregate([
		{ $unwind: '$referenced_tweets' },
		{
			$match: {
				created_at,
				'referenced_tweets.type': type,
			},
		},
		{ $group: { _id: '$referenced_tweets.id' } },
	]);
	return objArray.map((tweet) => tweet._id);
}
