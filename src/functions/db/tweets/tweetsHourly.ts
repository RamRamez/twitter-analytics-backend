import dbTimeRange from '../dbTimeRange';

const Tweets = require('../../../models/tweetModelV2');

export default async function tweetsHourly(time) {
	const created_at = dbTimeRange(time);
	return Tweets.aggregate([
		{
			$match: { created_at }
		},
		{
			$project: {
				_id: 0,
				hour: { $hour: '$created_at' },
			}
		},
		{
			$group: {
				_id: '$hour' ,
				count: { $sum: 1 }
			}
		},
		{ $sort: { '_id': 1 } },
		{
			$project: {
				_id: 0,
				hour: "$_id",
				count: 1
			}
		}
	]);
}
