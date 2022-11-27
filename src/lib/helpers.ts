import { ETimeRange } from '../types/timeRange';
import dbTimeRange from '../functions/db/dbTimeRange';

export function formatResponse(error: string) {
	return { message: error };
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
