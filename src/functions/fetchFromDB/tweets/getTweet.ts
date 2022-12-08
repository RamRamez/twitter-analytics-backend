import { ITweet } from '../../../types/tweet';
import Tweets from '../../../models/tweetModelV2';

export default async function getTweet(id: string): Promise<ITweet> {
	return Tweets.findOne({ id });
}
