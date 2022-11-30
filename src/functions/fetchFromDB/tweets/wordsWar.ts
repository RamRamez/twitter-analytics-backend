import { TTweetTypes } from '../../../types/referencedTweetsType';
import { matchCreator } from '../../../lib/helpers';

const Tweets = require('../../../models/tweetModelV2');

export default async function wordsWar(
	usernames?: string[],
	search?: string,
	fromDate?: string,
	toDate?: string,
	tweetTypes?: TTweetTypes[],
) {
	const $match = matchCreator(undefined, usernames, search, fromDate, toDate, tweetTypes);
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
