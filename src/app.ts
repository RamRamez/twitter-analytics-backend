import mongoose from 'mongoose';
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const session = require('express-session')
const parseurl = require('parseurl')
const MongoStore = require('connect-mongo')(session)
const { v4: uuidv4 } = require('uuid')

const { BACKEND_PORT, FRONTEND_URL, SESSION_SECRET } = process.env;

export async function App() {
	const app = express()
	app.use(cors({
		origin: FRONTEND_URL,
		methods:['GET','POST', 'OPTIONS'],
		credentials: true // enable set cookie
	}))
	app.use(express.json())
	app.use(bodyParser.urlencoded({ extended: false }))
	app.use(session({
		genid: () => uuidv4(),
		cookie : {
			maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
			// secure: true // Later for https enabled envs
		},
		secret: SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({ mongooseConnection: mongoose.connection })
	}))
	console.log('App is running on port', BACKEND_PORT)
}