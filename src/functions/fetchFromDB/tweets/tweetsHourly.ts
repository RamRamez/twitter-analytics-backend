import { matchCreator } from '../../../lib/helpers';
import Tweets from '../../../models/tweetModelV2';
import { ITweetsHourly } from '../../../types/api';

export default async function tweetsHourly(time, usernames): Promise<ITweetsHourly[]> {
	const $match = matchCreator(time, usernames);
	return Tweets.aggregate([
		{ $match },
		{
			$project: {
				_id: 0,
				hour: { $hour: '$created_at' },
			},
		},
		{
			$group: {
				_id: '$hour',
				count: { $sum: 1 },
			},
		},
		{ $sort: { _id: 1 } },
		{
			$project: {
				_id: 0,
				hour: '$_id',
				count: 1,
			},
		},
	]);
}
