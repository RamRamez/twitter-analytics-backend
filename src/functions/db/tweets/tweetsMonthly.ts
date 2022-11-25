import dbTimeRange from '../dbTimeRange';

const Tweets = require('../../../models/tweetModelV2');

export default async function tweetsMonthly(time) {
	const created_at = dbTimeRange(time);
	return Tweets.aggregate([
		{
			$match: { created_at }
		},
		{
			$project: {
				_id: 0,
				month: { $month: '$created_at' },
				year: { $year: '$created_at' }
			}
		},
		{
			$group: {
				_id: { month: '$month', year: '$year' },
				count: { $sum: 1 }
			}
		},
		{ $sort: { '_id.year': 1, '_id.month': 1 } },
		{
			$project: {
				_id: 0,
				date: { $concat: [ { $toString: "$_id.year" }, "/", { $toString: "$_id.month" } ] },
				count: 1
			}
		}
	]);
}
