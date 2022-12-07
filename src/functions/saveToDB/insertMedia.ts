import { IMedia } from '../../types/media';

const Media = require('../../models/mediaModelV2');

export async function insertMedia(media: IMedia[]) {
	try {
		await Media.insertMany(media, { ordered: false });
	} catch {
		return;
	}
}
