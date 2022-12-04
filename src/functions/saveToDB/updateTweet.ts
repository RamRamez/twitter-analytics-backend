import { ITweet } from '../../types/tweet';

const Tweets = require('../../models/tweetModelV2');

export async function updateTweet(tweet: ITweet) {
	return Tweets.findOneAndUpdate({ id: tweet.id }, tweet, {upsert: true})
}