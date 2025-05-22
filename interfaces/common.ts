export interface IPhoneCode {
	counryCode: string;
	phoneCode: string;
	name: string;
	currency: string;
}

export interface IBankCard {
	id: string;
	ownerId: string;
	bankCardToken: string;
	cardNumber: string;
	activeToMonth: number;
	activeToYear: number;
	cvv: string;
}

export interface IFileLoaded {
	id: string;
	type: string;
	name: string;
	path: string;
	url: string;
}

export interface IPhoto {
	id: string;
	ownerId: string;
	documentId: string;
	fileId: string;
	name: string;
	useAsLogo?: boolean;
	file: IFileLoaded;
}

export interface ILoadedDocument {
	id: string;
	ownerId: string;
	documentTypeId: string;
	number: string;
	issueDate: string;
	expariedDate: string;
	issuedBy: string;
	documentType: {
		id: string;
		name: string;
		numberInputMask: string;
	};
	documentPhotos: IPhoto[];
}

export interface IPagination {
	pageNumber: number;
	pageSize: number;
	totalPages: number;
	totalItemQuantity?: number;
}

export interface IStatusUiOptions {
	backgroundColor: string;
	textColor: string;
	icon: string;
	url?: string;
}

export interface IStatus<Ui> {
	id: string;
	name: string;
	description: string;
	uiOptions: Ui;
	categoryId: string;
}

export interface ICity {
	id: string;
	name: string;
	districts: IDistrict[];
}

export interface IDistrict {
	id: string;
	name: string;
	cityId: string;
}

export interface IProfession {
	id: string;
	name: string;
	logoUrl: string;
}

export interface IRating {
	raiting: number;
	calculated: string;
	calculatedReviewsCount: number;
}
