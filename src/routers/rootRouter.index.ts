import { Router } from 'express';
import routes from '../routes';
import { isSignedInRouter } from './isSignedInRouter';
import { loginRouter } from './loginRouter';
import middleware from '../functions/middleware/middleware';
import { logoutRouter } from './logoutRouter';
import adminMiddleware from '../functions/middleware/adminMiddleware';
import { adminRouter } from './adminRouter';
import { dashboardRouter } from './dashboardRouter';

export const rootRouter = Router();

rootRouter.use(routes.isSignedIn, isSignedInRouter);
rootRouter.use(routes.login, loginRouter);
rootRouter.use(middleware);
rootRouter.use(routes.logout, logoutRouter);
rootRouter.use(routes.admin, adminMiddleware);
rootRouter.use(routes.admin, adminRouter);
rootRouter.use(routes.dashboard, dashboardRouter);
