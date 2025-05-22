export interface ISubscribeReq {
	status: boolean;
	msg: string;
	data: ISubscribeDetail;
}

export interface ISubscribeDetail {
	subscription_status: boolean;
	can_activate: boolean;
	cur: CurSubscribe;
	next: NextSubscribe;
}

export interface CurSubscribe {
	DtStart: string;
	DtFinish: string;
	DaysLeft: number;
}

export interface NextSubscribe {
	period: number;
	period_description: string;
	subscription_cost: number;
}
