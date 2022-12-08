import axios from 'axios';
import { addAuthorsToTweets, handleLog } from '../../lib/helpers';
import getToken from '../fetchFromDB/getToken';
import { IRawTweet } from '../../types/tweet';
import insertMedia from '../saveToDB/insertMedia';
import insertTweets from '../saveToDB/insertTweets';
import ErrorTag from '../../lib/ErrorTag';

const expansions =
	'&expansions=attachments.media_keys,author_id,edit_history_tweet_ids,entities.mentions.username,geo.place_id,in_reply_to_user_id,referenced_tweets.id,referenced_tweets.id.author_id';
const mediaFields =
	'&media.fields=preview_image_url,type,url,public_metrics,alt_text,variants';
const userFields = '&user.fields=name,username,profile_image_url';
const tweetFields =
	'&tweet.fields=public_metrics,attachments,author_id,context_annotations,conversation_id,created_at,entities,geo,id,in_reply_to_user_id,lang,possibly_sensitive,referenced_tweets,reply_settings,source,text,withheld';
const placeFields =
	'&place.fields=contained_within,country,full_name,geo,name,place_type';
const fetchUrl1 = 'https://api.twitter.com/2/users/';
const fetchUrl2 = '/tweets?max_results=100';
const reqConfig = {
	headers: {
		authorization: '',
		'User-Agent':
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
	},
};

const fetchUserTweetsById = async (userId: string, sinceId?: string): Promise<string> => {
	try {
		const { token } = (await getToken()) || {};
		reqConfig.headers.authorization = 'Bearer ' + token;
		const baseUrl =
			fetchUrl1 +
			userId +
			fetchUrl2 +
			tweetFields +
			userFields +
			expansions +
			mediaFields +
			placeFields;
		const url = sinceId ? baseUrl + `&since_id=${sinceId}` : baseUrl;
		const lastTweetId = await fetchTweets(url, 1);
		return lastTweetId;
	} catch (error) {
		const tag = error.tag || 'fetchUserTweetsById';
		handleLog(error, tag);
		throw new ErrorTag(error, tag);
	}
};

const fetchTweets = async (
	url: string,
	iteration: number,
	nextToken?: string,
): Promise<string> => {
	try {
		let lastTweetId: string;
		const _url = nextToken ? url + '&pagination_token=' + nextToken : url;
		const res = await axios.get(_url, reqConfig);
		const resData: IRawTweet = res.data;
		const { data, includes } = resData || {};
		if (!data || data.length === 0) {
			return '';
		}
		if (iteration === 1) {
			lastTweetId = data[0].id;
		}
		const { media, users, tweets } = includes || {};
		await insertMedia(media);
		const allTweets = [...data, ...tweets];
		const tweetsWithAuthors = addAuthorsToTweets(allTweets, users);
		await insertTweets(tweetsWithAuthors);
		handleLog(
			'User ID ' + data[0].author_id + ' iteration No: ' + iteration + ' saved!',
		);
		const resNextToken = res?.data?.meta?.next_token;
		if (resNextToken) {
			await fetchTweets(url, iteration + 1, resNextToken);
		}
		return lastTweetId;
	} catch (error) {
		const tag = error.tag || 'fetchTweets';
		handleLog(error, tag);
		throw new ErrorTag(error, tag);
	}
};

export default fetchUserTweetsById;
