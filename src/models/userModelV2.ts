import { model, Schema } from 'mongoose';

const urlModel = new Schema({
	start: { type: Number, required: true },
	end: { type: Number, required: true },
	url: { type: String, required: true },
	expanded_url: { type: String, required: true },
	display_url: { type: String, required: true },
});

const urlsModel = new Schema({
	urls: { type: [urlModel], required: false },
});

const mentionModel = new Schema({
	start: { type: Number, required: true },
	end: { type: Number, required: true },
	username: { type: String, required: true },
});

const descriptionModel = new Schema({
	urls: { type: [urlModel], required: false },
	mentions: { type: [mentionModel], required: false },
});

const entitiesModel = new Schema({
	url: { type: urlsModel, required: false },
	description: { type: descriptionModel, required: false },
});

const publicMetricsModel = new Schema({
	followers_count: { type: Number, required: false },
	following_count: { type: Number, required: false },
	tweet_count: { type: Number, required: false },
	listed_count: { type: Number, required: false },
});

const userModelV2 = new Schema({
	id: { type: String, required: true, unique: true },
	name: { type: String, required: true },
	username: { type: String, required: true },
	created_at: { type: Date, required: true },
	description: { type: String, required: false },
	entities: { type: entitiesModel, required: false },
	location: { type: String, required: false },
	pinned_tweet_id: { type: String, required: false },
	profile_image_url: { type: String, required: false },
	protected: { type: Boolean, required: false },
	public_metrics: { type: publicMetricsModel, required: false },
	url: { type: String, required: false },
	verified: { type: Boolean, required: false },
	withheld: { type: Object, required: false },
});

const userV2 = model('userModelV2', userModelV2, 'users');

module.exports = userV2;
