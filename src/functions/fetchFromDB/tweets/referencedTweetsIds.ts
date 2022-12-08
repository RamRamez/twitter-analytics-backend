import { EReferencedTweetsType } from '../../../types/referencedTweetsType';
import { matchCreator } from '../../../lib/helpers';
import Tweets from '../../../models/tweetModelV2';

export default async function referencedTweetsIds(
	time,
	type = EReferencedTweetsType.retweeted,
	usernames,
) {
	const $match = matchCreator(time, usernames);
	$match['referenced_tweets.type'] = type;
	// TODO: a tweet maybe referenced by multiple tweets. It affects social network analysis.
	const objArray = await Tweets.aggregate([
		{ $unwind: '$referenced_tweets' },
		{ $match },
		{ $group: { _id: '$referenced_tweets.id' } },
	]);
	return objArray.map(tweet => tweet._id);
}
