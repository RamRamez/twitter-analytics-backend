export enum EReferencedTweetsType {
	retweeted = 'retweeted',
	replied_to = 'replied_to',
	quoted = 'quoted',
}

export enum TTweetOnly {
	tweet = 'tweet',
}

export type TTweetTypes = EReferencedTweetsType | TTweetOnly;
