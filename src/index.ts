import { existsSync, writeFileSync } from 'fs';
import path from 'path';
import { config } from 'dotenv';
import { connect } from 'mongoose';
import App from './app';
import { handleLog } from './lib/helpers';

global.logFile = path.join(__dirname, '/../log.txt');

config();

const { DB_URI } = process.env;

main().catch(console.log);

async function main() {
	try {
		await connect(DB_URI);
		const logExists = existsSync(global.logFile);
		if (!logExists) {
			writeFileSync(global.logFile, '');
		}
		App();
	} catch (error) {
		handleLog(error, 'main');
	}
}
