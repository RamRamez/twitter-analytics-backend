import { ETimeRange } from '../types/timeRange';

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

export function matchCreator(time?: ETimeRange, users?: string[]) {
	const match: any = {};
	if (time && time !== ETimeRange.all) {
		match.created_at = dbTimeRange(time);
	}
	if (users?.length > 0) {
		match['author.username'] = { $in: users };
	}
	return match;
}
