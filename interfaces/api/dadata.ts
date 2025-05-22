export interface SuggestionReq {
	suggestions: Suggestion[];
}

export interface Suggestion {
	value: string;
	unrestricted_value: string;
	data: Data;
}

export interface Data {
	kpp: string;
	capital: any;
	invalid: any;
	management: Management;
	founders: any;
	managers: any;
	predecessors: any;
	successors: any;
	branch_type: string;
	branch_count: number;
	source: any;
	qc: any;
	hid: string;
	type: string;
	state: State;
	opf: Opf;
	name: Name;
	inn: string;
	ogrn: string;
	okpo: any;
	okato: any;
	oktmo: any;
	okogu: any;
	okfs: any;
	okved: string;
	okveds: any;
	authorities: any;
	documents: any;
	licenses: any;
	finance: any;
	address: Address;
	phones: any;
	emails: any;
	ogrn_date: number;
	okved_type: string;
	employee_count: any;
}

export interface Management {
	name: string;
	post: string;
	disqualified: any;
}

export interface State {
	status: string;
	code: string;
	actuality_date: number;
	registration_date: number;
	liquidation_date: number;
}

export interface Opf {
	type: string;
	code: string;
	full: string;
	short: string;
}

export interface Name {
	full_with_opf: string;
	short_with_opf: string;
	latin: any;
	full: string;
	short: string;
}

export interface Address {
	value: string;
	unrestricted_value: string;
	invalidity: any;
	data: Data2;
}

export interface Data2 {
	postal_code: string;
	country: string;
	country_iso_code: string;
	federal_district: string;
	region_fias_id: string;
	region_kladr_id: string;
	region_iso_code: string;
	region_with_type: string;
	region_type: string;
	region_type_full: string;
	region: string;
	area_fias_id: any;
	area_kladr_id: any;
	area_with_type: any;
	area_type: any;
	area_type_full: any;
	area: any;
	city_fias_id: string;
	city_kladr_id: string;
	city_with_type: string;
	city_type: string;
	city_type_full: string;
	city: string;
	city_area: string;
	city_district_fias_id: any;
	city_district_kladr_id: any;
	city_district_with_type: string;
	city_district_type: string;
	city_district_type_full: string;
	city_district: string;
	settlement_fias_id: any;
	settlement_kladr_id: any;
	settlement_with_type: any;
	settlement_type: any;
	settlement_type_full: any;
	settlement: any;
	street_fias_id: string;
	street_kladr_id: string;
	street_with_type: string;
	street_type: string;
	street_type_full: string;
	street: string;
	stead_fias_id: any;
	stead_cadnum: any;
	stead_type: any;
	stead_type_full: any;
	stead: any;
	house_fias_id: string;
	house_kladr_id: string;
	house_cadnum: string;
	house_flat_count: any;
	house_type: string;
	house_type_full: string;
	house: string;
	block_type: any;
	block_type_full: any;
	block: any;
	entrance: any;
	floor: any;
	flat_fias_id: any;
	flat_cadnum: any;
	flat_type: any;
	flat_type_full: any;
	flat: any;
	flat_area: string;
	square_meter_price: string;
	flat_price: any;
	room_fias_id: any;
	room_cadnum: any;
	room_type: any;
	room_type_full: any;
	room: any;
	postal_box: any;
	fias_id: string;
	fias_code: string;
	fias_level: string;
	fias_actuality_state: string;
	kladr_id: string;
	geoname_id: string;
	capital_marker: string;
	okato: string;
	oktmo: string;
	tax_office: string;
	tax_office_legal: string;
	timezone: string;
	geo_lat: string;
	geo_lon: string;
	beltway_hit: string;
	beltway_distance: any;
	metro: Metro[];
	divisions: any;
	qc_geo: string;
	qc_complete: any;
	qc_house: any;
	history_values: any;
	unparsed_parts: any;
	source: string;
	qc: string;
}

export interface Metro {
	name: string;
	line: string;
	distance: number;
}
