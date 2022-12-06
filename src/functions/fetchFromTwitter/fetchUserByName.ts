import getToken from '../saveToDB/getToken';
import { handleLog } from '../../lib/helpers';
import { IRawUser } from '../../types/user';

const axios = require("axios");

const expansions = '&expansions=pinned_tweet_id'
const userFields = '&user.fields=created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld'
const tweetFields = "&tweet.fields=public_metrics,attachments,author_id,context_annotations,conversation_id,created_at,entities,geo,id,in_reply_to_user_id,lang,possibly_sensitive,referenced_tweets,reply_settings,source,text,withheld"
const baseUrl = 'https://api.twitter.com/2/users/by/username/'
const reqConfig = {
	headers:{
		'authorization': '',
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
	}
}

export const fetchUserByName = async (username: string): Promise<IRawUser> => {
	try {
		const { token } = await getToken() || {}
		reqConfig.headers.authorization = 'Bearer ' + token
		const url = baseUrl + username + '?' + tweetFields + userFields + expansions
		const { data } = await axios.get(url, reqConfig);
		return data;
	} catch (error) {
		const tag = error.tag || 'fetchUserByName';
		!error.tag && handleLog(error, tag);
		throw { ...error, tag };
	}
}