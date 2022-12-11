import Tweets from '../../../models/tweetModelV2';
import { ISocialNetwork } from '../../../types/api';

export default async function findSocialNetwork(
	tweetIds: string[],
	limit?: number,
): Promise<ISocialNetwork[]> {
	return Tweets.aggregate([
		{
			$match: {
				id: { $in: tweetIds },
			},
		},
		{ $group: { _id: '$author.username', count: { $sum: 1 } } },
		{ $sort: { count: -1 } },
		{ $limit: limit || 10 },
		{ $project: { _id: 0, username: '$_id', count: 1 } },
	]);
}
