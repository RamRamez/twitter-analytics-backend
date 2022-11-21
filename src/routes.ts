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
	mostInfluentialTweets: '/mostInfluentialTweets',
};

export default routes;
