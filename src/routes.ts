const rootRoute = '/';

const routes = {
	root: rootRoute,
	isSignedIn: rootRoute + 'isSignedIn',
	login: rootRoute + 'login',
	logout: rootRoute + 'logout',
	admin: rootRoute + 'admin',
	dashboard: rootRoute + 'dashboard',
};

export const adminRoutes = {
	addUser: '/addUser',
};

export const dashboardRoutes = {
	general: '/',
	hashtagsAbundance: '/hashtagsAbundance',
	mostInfluentialTweets: '/mostInfluentialTweets',
	socialNetwork: '/socialNetwork',
	tweetsTypes: '/tweetsTypes',
	tweetsLanguages: '/tweetsLanguages',
	tweetsMonthly: '/tweetsMonthly',
	tweetsHourly: '/tweetsHourly',
	tweetsSource: '/tweetsSource',
	users: '/users',
	user: '/user',
};

export default routes;
