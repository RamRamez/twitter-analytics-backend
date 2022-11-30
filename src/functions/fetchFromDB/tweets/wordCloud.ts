import { TTweetTypes } from '../../../types/referencedTweetsType';
import { matchCreator } from '../../../lib/helpers';

const Tweets = require('../../../models/tweetModelV2');

export default async function wordCloud(
	usernames?: string[],
	search?: string,
	fromDate?: string,
	toDate?: string,
	tweetTypes?: TTweetTypes[],
) {
	const $match = matchCreator(undefined, usernames, search, fromDate, toDate, tweetTypes);
	const $limit = 80;
	return Tweets.aggregate([
		{$match},
		{ $project: {
				text: { $replaceAll: { input: "$text", find: "\n", replacement: "" } },
				_id: 0
			}
		},
		{
			$addFields: {
				words: {
					$map: {
						input: { $split: ['$text', ' '] },
						as: 'str',
						in: {
							$trim: {
								input: { $toLower: ['$$str'] },
								chars: " ,|(){}-<>.;"
							}
						}
					}
				}
			}
		},
		{ $unwind: '$words' },
		{
			$match: {
				words: {
					$nin: ["", "also", "i", "me", "my", "myself", "we", "us", "you’re",
						"our", "ours", "ourselves", "you", "your", "yours", "i’m",
						"yourself", "yourselves", "he", "him", "his", "it’s",
						"himself", "she", "her", "hers", "herself", "it", "new", "one",
						"its", "itself", "they", "them", "their", "theirs",
						"themselves", "what", "which", "who", "whom", "whose",
						"this", "that", "these", "those", "am", "is", "are",
						"was", "were", "be", "been", "being", "have", "has",
						"had", "having", "do", "does", "did", "doing", "will",
						"would", "should", "can", "could", "ought", "i'm",
						"you're", "he's", "she's", "it's", "we're", "they're",
						"i've", "you've", "we've", "they've", "i'd", "you'd",
						"he'd", "she'd", "we'd", "they'd", "i'll", "you'll",
						"he'll", "she'll", "we'll", "they'll", "isn't",
						"aren't", "wasn't", "weren't", "hasn't", "haven't",
						"hadn't", "doesn't", "don't", "didn't", "won't",
						"wouldn't", "shan't", "shouldn't", "can't", "cannot",
						"couldn't", "mustn't", "let's", "that's", "who's",
						"what's", "here's", "there's", "when's", "where's",
						"why's", "how's", "a", "an", "the", "and", "but",
						"if", "or", "because", "as", "until", "while", "of",
						"at", "by", "for", "with", "about", "against",
						"between", "into", "through", "during", "before",
						"after", "above", "below", "to", "from", "up", "upon",
						"down", "in", "out", "on", "off", "over", "under",
						"again", "further", "then", "once", "here", "there", "when",
						"where", "why", "how", "all", "any", "both", "each",
						"few", "more", "most", "other", "some", "such", "no",
						"nor", "not", "only", "own", "same", "so", "than",
						"too", "very", "say", "says", "said", "shall", "rt", "&amp", "w/", "w/o"]
				}
			}
		},
		{ $group: { _id: '$words', count: { $sum: 1 } } },
		{ $project: { word: '$_id', count: 1, _id: 0 } },
		{$sort: { count: -1 }},
		{$limit}
	]);
}
