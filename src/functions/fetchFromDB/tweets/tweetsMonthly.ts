import { matchCreator } from '../../../lib/helpers';
import Tweets from '../../../models/tweetModelV2';
import ETimeRange from '../../../types/timeRange';
import { ICountMonthly } from '../../../types/api';

export default async function tweetsMonthly(
	time: ETimeRange,
	usernames: string[],
): Promise<ICountMonthly[]> {
	const $match = matchCreator(time, usernames);
	return Tweets.aggregate([
		{ $match },
		{
			$project: {
				_id: 0,
				month: { $month: '$created_at' },
				year: { $year: '$created_at' },
			},
		},
		{
			$group: {
				_id: { month: '$month', year: '$year' },
				count: { $sum: 1 },
			},
		},
		{ $sort: { '_id.year': 1, '_id.month': 1 } },
		{
			$project: {
				_id: 0,
				date: {
					$concat: [
						{ $toString: '$_id.year' },
						'/',
						{ $toString: '$_id.month' },
					],
				},
				count: 1,
			},
		},
	]);
}
