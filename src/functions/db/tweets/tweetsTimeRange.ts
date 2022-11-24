import dbTimeRange from '../dbTimeRange';

const Tweets = require('../../../models/tweetModelV2');

export default async function tweetsTimeRange(time) {
	const created_at = dbTimeRange(time);
	return  Tweets.aggregate([
		{ "$group": {
				"_id": null,
				"max": { "$max": "$price" },
				"min": { "$min": "$price" }
			}}
	]);
}
