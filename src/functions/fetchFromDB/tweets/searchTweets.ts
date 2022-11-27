import { ETimeRange } from '../../../types/timeRange';
import { matchCreator } from '../../../lib/helpers';

const Tweets = require('../../../models/tweetModelV2');

export default async function searchTweets(time: ETimeRange, usernames?: string[], search?: string) {
	const match = matchCreator(time, usernames, search);
	return Tweets.find(match);
}