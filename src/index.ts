import { App } from './app';
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');

const { DB_URI } = process.env;

main().catch(console.log);

async function main() {
	await mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
	const logExists = fs.existsSync(__dirname + '/../log.txt')
	if (!logExists) {
		fs.writeFileSync(__dirname + '/../log.txt', '');
	}
	await App();
}
