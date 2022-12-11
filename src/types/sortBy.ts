export enum ESortByDate {
	newest = 'newest',
	oldest = 'oldest',
}

export interface ISortBy {
	[key: string]: 1 | -1;
}
