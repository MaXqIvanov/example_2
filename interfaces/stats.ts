export interface IStats {
	guid: string;
	description: string;
	crypt_pair: string;
	status: number;
	amount_profit: number;
	count_deals: number;
	history: History[];
}

export interface History {
	step: number;
	profit_usdt: number;
	procent: number;
	sell_dt: string;
}

export interface IStatsProfitItem {
	coin: string;
	date_create: Date;
	profit_usdt: number;
}
export interface IStatsProfit {
	summ: number;
	items: IStatsProfitItem;
	_count: number;
	date_in: string;
}
export interface IStatsProfitResponse {
	status: boolean;
	msg: string;
	data: IStatsProfit[];
}
