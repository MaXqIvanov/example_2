export interface IBots {
	token_guid: string;
	dt_in: string;
	type_bot_id: number;
	description: string;
	status: number;
	guid: string;
	stock_id: number;
	price_limit_high: number;
	price_limit_low: number;
	is_enable: boolean;
	crypt_pair: string;
	coin_id: string;
	sum_pofit_usdt: number;
	sum_in_position: number;
	finished_deals_count: number;
	last: number;
	pnl: number;
	max_usdt: number;
	allow_sell: boolean;
	flag_upper_price: boolean;
	use_hedging: boolean;
	use_limit_order_sell: boolean;
	sum_usdt: number;
	coins: number;
	cur_pnl: number;
	avg_price: number;
	procent: number;
	userId: string;
	timeout_between_buy_steps: number;
	amount_steps: number;
	cur_step: number;
}
export interface IBotsAction {
	token_guid: string;
	description: string;
	stock_id: number;
	price_limit_high: number;
	price_limit_low: number;
	is_enable: boolean;
	coin_id: string;
	timeout_between_buy_steps: number;
}

export interface IBotChangeStateReq {
	status: boolean;
	msg: string;
	data: IBots;
}

export interface IBotStartDealReq {
	status: boolean;
	data: {
		id: number;
		client_id: number;
		type_bot_id: number;
		description: string;
		status: number;
		guid: string;
		stock_id: number;
		price_limit_high: number;
		price_limit_low: number;
		is_enable: boolean;
		crypt_pair: string;
		coin_id: string;
		sum_pofit_usdt: number;
		sum_in_position: number;
		finished_deals_count: number;
		last: number;
		scale_after_dot: number;
		pnl: number;
		max_usdt: number;
		allow_sell: boolean;
		flag_upper_price: boolean;
		use_hedging: boolean;
		use_limit_order_sell: boolean;
		sum_usdt: number;
		coins: number;
		cur_pnl: number;
		avg_price: number;
		procent: number;
		userId: string;
		timeout_between_buy_steps: number;
		amount_steps: number;
		cur_step: number;
		available_balance: number;
	};
}
