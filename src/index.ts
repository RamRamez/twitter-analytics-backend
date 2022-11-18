import { App } from './app';
require('dotenv').config();
const mongoose = require('mongoose');

const { DB_URI } = process.env;

main().catch(console.log);

async function main() {
	await mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
	await App();
}
