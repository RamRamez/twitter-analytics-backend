import { ITweet } from '../../../types/tweet';

const Tweets = require('../../../models/tweetModelV2');

export default async function getTweet(id: string): Promise<ITweet> {
	return Tweets.findOne({ id });
}