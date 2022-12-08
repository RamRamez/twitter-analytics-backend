import Media from '../../../models/mediaModelV2';

export default async function getMedia(ids: string[]) {
	return Media.find({ media_key: { $in: ids } });
}
