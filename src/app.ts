import { rootRouter } from './routers/rootRouter.index';
import routes from './routes';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { v4: uuidv4 } = require('uuid');

const { DB_URI, BACKEND_PORT, FRONTEND_URL, SESSION_SECRET } = process.env;

export async function App() {
	const app = express();
	app.use(
		cors({
			origin: FRONTEND_URL,
			methods: ['GET', 'POST', 'OPTIONS'],
			credentials: true, // enable set cookie
		}),
	);
	app.use(express.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(
		session({
			genid: () => uuidv4(),
			cookie: {
				maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
				// secure: true // Later for https enabled envs
			},
			secret: SESSION_SECRET,
			resave: false,
			saveUninitialized: false,
			store: MongoStore.create({ mongoUrl: DB_URI }),
		}),
	);
	app.use(routes.root, rootRouter);
	app.listen(BACKEND_PORT, () => {
		console.log(`Backend is listening on port: ${BACKEND_PORT}`);
	});
}
