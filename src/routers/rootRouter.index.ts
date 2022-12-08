import { Router } from 'express';
import routes from '../routes';
import middleware from '../functions/middleware/middleware';
import adminMiddleware from '../functions/middleware/adminMiddleware';
import isSignedInRouter from './isSignedInRouter';
import loginRouter from './loginRouter';
import logoutRouter from './logoutRouter';
import adminRouter from './adminRouter';
import dashboardRouter from './dashboardRouter';

const rootRouter = Router();

rootRouter.use(routes.isSignedIn, isSignedInRouter);
rootRouter.use(routes.login, loginRouter);
rootRouter.use(middleware);
rootRouter.use(routes.logout, logoutRouter);
rootRouter.use(routes.admin, adminMiddleware);
rootRouter.use(routes.admin, adminRouter);
rootRouter.use(routes.dashboard, dashboardRouter);

export default rootRouter;
