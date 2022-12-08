import { ITweet } from '../../types/tweet';
import Tweets from '../../models/tweetModelV2';

export default async function insertTweets(tweets: ITweet[]) {
	try {
		await Tweets.insertMany(tweets, { ordered: false });
	} catch {
		return;
	}
}
