import { model, Schema } from 'mongoose';

const variantModel = new Schema({
	bit_rate: { type: Number, required: false },
	content_type: { type: String, required: false },
	url: { type: String, required: false },
});

const publicMetricsModel = new Schema({
	view_count: { type: Number, required: false },
});

const mediaModelV2 = new Schema({
	media_key: { type: String, required: false, unique: true },
	url: { type: String, required: false },
	type: { type: String, required: false },
	preview_image_url: { type: String, required: false },
	variants: { type: [variantModel], required: false },
	duration_ms: { type: Number, required: false },
	height: { type: Number, required: false },
	width: { type: Number, required: false },
	alt_text: { type: String, required: false },
	public_metrics: { type: publicMetricsModel, required: false },
});

const mediaV2 = model('mediaModelV2', mediaModelV2, 'media');

module.exports = mediaV2;
