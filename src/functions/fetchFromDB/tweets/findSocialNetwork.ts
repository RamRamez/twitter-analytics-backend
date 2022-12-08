import Tweets from '../../../models/tweetModelV2';

export default async function findSocialNetwork(tweetIds: string[], limit = 10) {
	return Tweets.aggregate([
		{
			$match: {
				id: { $in: tweetIds },
			},
		},
		{ $group: { _id: '$author.username', count: { $sum: 1 } } },
		{ $sort: { count: -1 } },
		{ $limit: limit },
		{ $project: { _id: 0, username: '$_id', count: 1 } },
	]);
}
