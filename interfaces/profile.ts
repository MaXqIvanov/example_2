export interface IProfileUser {
	Id: string;
	phone: string;
	login: string;
	name: string;
	bot_count: number;
	token_count: number;
	RefCode: string;
	sum_usdt: number;
	dt_update: string;
	subscription_status: boolean;
	extensions: IExtension[];
}

export interface IExtension {
	FieldName: 'flag_upper_price' | 'use_limit_order_sell' | 'use_hedging';
	Title: string;
	Description: string;
	IsActive: boolean;
	Fields: IFields[];
}

export interface IFields {
	title: string;
	field_name: string;
	type: string;
	action: 'edit' | 'view';
}
export interface IRegisterReq {
	status: boolean;
	msg: string;
	data: {
		url: string;
		comment: string;
		botName: string;
	};
}
