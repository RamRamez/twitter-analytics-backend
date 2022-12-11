import Media from '../../../models/mediaModelV2';
import { IMedia } from '../../../types/media';

export default async function getMedia(ids: string[]): Promise<IMedia[]> {
	return Media.find({ media_key: { $in: ids } });
}
