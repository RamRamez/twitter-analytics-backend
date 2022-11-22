require('dotenv').config();
// const mongoose = require('mongoose');
// const Users = require('../../models/userModelSimple.ts')
const fs = require('fs');
const Path = require('path');

const { DB_URI } = process.env;

saveAllUsers().catch(console.log);

let files = [];
const dir = '../../../archive/givethTweets/';

async function saveAllUsers() {
	await mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
	findAllFiles(dir);

	const promises = files.map(file =>
		Users.insertMany(readFile(file), { ordered: false }),
	);
	await Promise.all(promises);

	console.log('Done');
}

function findAllFiles(directory) {
	fs.readdirSync(directory).forEach(file => {
		const absolute = Path.join(directory, file);
		if (fs.statSync(absolute).isDirectory()) return findAllFiles(absolute);
		else return files.push(absolute);
	});
}

function readFile(path) {
	const stringData = fs.readFileSync(path, 'utf8');
	const { includes } = JSON.parse(stringData);
	return includes.users;
}
