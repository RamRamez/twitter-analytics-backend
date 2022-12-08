import parseurl from 'parseurl';
import UserActivity from '../../models/userActivity';

let usersQueries = [];
const saveQueriesInterval = 1000 * 60; // 1 min

// Catch user queries in temp var for future saving
export default function catchQueries(request) {
	const { body, session, headers, connection } = request;
	const url = parseurl(request);
	const query = decodeURI(url.search ? url.pathname + url.search : url.pathname);
	const ip = headers['x-forwarded-for'] || connection?.remoteAddress;
	const userActivity = {
		username: session.user.username,
		query,
		body,
		userAgent: request.get('user-agent'),
		sessionId: session.id,
		ip: ip?.split(':')?.slice(-1)[0],
		date: new Date(),
	};
	usersQueries.push(userActivity);
}

function insertQueries(queries) {
	if (queries.length !== 0) {
		UserActivity.insertMany(queries).catch(console.log);
	}
}

// Save sessions to DB every interval
setInterval(() => {
	insertQueries(usersQueries);
	usersQueries = []; // Clear temp queries
}, saveQueriesInterval);
