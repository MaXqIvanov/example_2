export interface IWalletDetails {
	cur_balance: number;
	date_change: string;
	deep: number;
	history: [
		{
			sum: number;
			type: 0 | 1 | 2;
			description: string;
			date_in: string;
			date_transform?: string;
		}
	];
}

export interface IWalletAddressDetails {
	users_id: string;
	shared_key: string;
}
