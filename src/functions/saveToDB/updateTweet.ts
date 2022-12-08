import { ITweet } from '../../types/tweet';
import Tweets from '../../models/tweetModelV2';

export default async function updateTweet(tweet: ITweet) {
	return Tweets.findOneAndUpdate({ id: tweet.id }, tweet, { upsert: true });
}
