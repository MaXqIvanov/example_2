export interface IKeys {
	guid: string;
	description: string;
	balance_usdt: string;
	pnl_usdt: string;
	bybit_api_k: string;
	bybit_api_s: string;
}

export interface IKeysAction {
	guid?: string;
	description: string;
	bybit_api_k: string;
	bybit_api_s: string;
}
