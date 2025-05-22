export interface IBotSteps {
	id: number;
	bot_guid: string;
	buy_currency: number;
	sell_currency: number;
	buy_percent: number;
	sell_percent: number;
	step: number;
	status: number;
	crypt_pair: string;
	is_work_start_detail: string;
	is_work_start_work: string;
	guid: string;
	quantity: number;
	klass_value_text: string;
	color: string;
	icon: string;
	finished_deals_count: number;
	sum_pofit_usdt: number;
	result: boolean;
	state_text: string;
	sum_in_position: number;
	is_deleted: boolean;
	pnl: number;
	real_buy_price: number;
	buy_dt: string;
}

export interface IBotStepAction {
	guid?: string;
	bot_guid: string;
	buy_percent: number;
	sell_percent: number;
	quantity: number;
}
