export const PROFIT_STAT_TYPE = {
	Day: { key: 'day', title: 'profit-page-type-day' },
	Month: { key: 'month', title: 'profit-page-type-month' },
	Year: { key: 'year', title: 'profit-page-type-year' }
};

export type TProfitStatKeys = (typeof PROFIT_STAT_TYPE)[keyof typeof PROFIT_STAT_TYPE]['key'];
