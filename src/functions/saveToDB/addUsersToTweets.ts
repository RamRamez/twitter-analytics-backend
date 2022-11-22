const mongoose = require('mongoose');
const Users = require('../../models/userModelSimple.ts');
const Tweets = require('../../models/tweetModelV2.ts');

addUsersToTweets().catch(console.log);

async function addUsersToTweets() {
	await mongoose.connect('mongodb://localhost:27017/Twitter', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	const tweets = await Tweets.find({}).select({ id: 1, author_id: 1, _id: 0 });
	let count = 0;
	for (const tweet of tweets) {
		count++;
		const author = await Users.findOne({ id: tweet.author_id });
		if (!author) {
			console.log('Tweet id ' + tweet.id + ' author not found');
		} else {
			await Tweets.findOneAndUpdate({ id: tweet.id }, { author });
		}
		console.log('Tweet No. ' + count + ' is done');
	}

	// await Tweets.updateMany({}, { $unset: { author_id: 1 } }, { multi: true })

	console.log('Done');
}
