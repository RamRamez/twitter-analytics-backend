import { ETimeRange } from '../types/timeRange';
import { ESortByDate } from '../types/sortBy';
import { EPublicMetrics } from '../types/publicMetrics';
import { TTweetOnly, TTweetTypes } from '../types/referencedTweetsType';

export function formatResponse(error: string) {
	return { message: error };
}

export function dbTimeRange(time: ETimeRange) {
	let d = new Date();
	if (time === 'week') {
		d.setDate(d.getDate() - 7);
	} else if (time === 'month') {
		d.setDate(d.getDate() - 30);
	} else if (time === '3month') {
		d.setDate(d.getDate() - 90);
	} else if (time === 'halfYear') {
		d.setDate(d.getDate() - 180);
	} else if (time === 'year') {
		d.setDate(d.getDate() - 365);
	} else {
		return { $exists: true };
	}
	return { $gte: new Date(d) };
}

export function matchCreator(
	time?: ETimeRange,
	users?: string[],
	search?: string,
	fromDate?: string,
	toDate?: string,
	tweetTypes?: TTweetTypes[],
) {
	const match: any = {};
	if (time && time !== ETimeRange.all) {
		match.created_at = dbTimeRange(time);
	}
	if (users?.length > 0) {
		match['author.username'] = { $in: users };
	}
	if (search) {
		match.$text = { $search: search };
	}
	if (fromDate) {
		if (!match.created_at) {
			match.created_at = {};
		}
		match.created_at['$gte'] = new Date(fromDate);
	}
	if (toDate) {
		if (!match.created_at) {
			match.created_at = {};
		}
		match.created_at['$lte'] = new Date(toDate);
	}
	if (tweetTypes?.length > 0) {
		if (tweetTypes.length === 1) {
			if (tweetTypes.includes(TTweetOnly.tweet)) {
				match['referenced_tweets'] = { $size: 0 };
			} else {
				match['referenced_tweets.type'] = tweetTypes[0];
			}
		} else {
			match['$or'] = [];
			match['$or'].push({ 'referenced_tweets.type': { $in: tweetTypes } });
			if (tweetTypes.includes(TTweetOnly.tweet)) {
				match['$or'].push({ referenced_tweets: { $size: 0 } });
			}
		}
	}
	return match;
}

export function sortByCreator(sortBy?: ESortByDate | EPublicMetrics) {
	const sort: any = {};
	if (Object.values(EPublicMetrics).includes(sortBy as EPublicMetrics)) {
		sort[`public_metrics.${sortBy}`] = -1;
	} else if (sortBy === ESortByDate.newest) {
		sort.created_at = -1;
	} else if (sortBy === ESortByDate.oldest) {
		sort.created_at = 1;
	}
	return sort;
}
