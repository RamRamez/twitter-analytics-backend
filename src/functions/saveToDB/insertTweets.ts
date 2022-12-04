import { ITweet } from '../../types/tweet';

const Tweets = require('../../models/tweetModelV2');

export async function insertTweets(tweets: ITweet[]) {
	try {
		await Tweets.insertMany(tweets, { ordered : false });
	} catch {
		return
	}
}