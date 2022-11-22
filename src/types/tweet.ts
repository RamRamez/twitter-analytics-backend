export interface ITweetAnnotation {
	start: number;
	end: number;
	probability: number;
	type: string;
	normalized_text: string;
}

export interface ITweetHashtag {
	start: number;
	end: number;
	tag: string;
}

export interface ITweetMention {
	start: number;
	end: number;
	username: string;
	id: string;
}

interface ITweetEntitiesUrlImage {
	url: string;
	width: number;
	height: number;
}

export interface ITweetUrl {
	start: number;
	end: number;
	url: string;
	expanded_url: string;
	display_url: string;
	images: ITweetEntitiesUrlImage[];
	status: number;
	title: string;
	description: string;
	unwound_url: string;
	media_key: string;
}

export interface ITweetEntities {
	annotations?: ITweetAnnotation[];
	hashtags?: ITweetHashtag[];
	mentions?: ITweetMention[];
	urls?: ITweetUrl[];
}

export interface ITweetAttachments {
	media_keys: string[];
}

export interface ITweetContextAnnotation {
	domain?: {
		id: string;
		name: string;
		description: string;
	};
	entity?: {
		id: string;
		name: string;
		description: string;
	};
}

export interface ITweetPublicMetrics {
	retweet_count: number;
	reply_count: number;
	like_count: number;
	quote_count: number;
}

interface ITweetReferencedTweet {
	type: string;
	id: string;
}

interface ITweetAuthor {
	id: string;
	name: string;
	username: string;
	profile_image_url: string;
}

export interface ITweet {
	attachments?: ITweetAttachments;
	author: ITweetAuthor;
	context_annotations: ITweetContextAnnotation[];
	conversation_id: string;
	created_at: string;
	edit_history_tweet_ids: string[];
	entities: ITweetEntities;
	id: string;
	lang: string;
	possibly_sensitive: boolean;
	public_metrics: ITweetPublicMetrics;
	referenced_tweets: ITweetReferencedTweet[];
	reply_settings: string;
	source: string;
	text: string;
}
