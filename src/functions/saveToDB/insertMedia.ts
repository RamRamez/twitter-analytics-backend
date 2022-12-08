import { IMedia } from '../../types/media';
import Media from '../../models/mediaModelV2';

export default async function insertMedia(media: IMedia[]) {
	try {
		await Media.insertMany(media, { ordered: false });
	} catch {
		return;
	}
}
