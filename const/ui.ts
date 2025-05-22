// ICONS
export enum DefaultIconParams {
	WIDTH = 24,
	HEIGHT = 24,
	COLOR = 'var(--violet)'
}

// AVATAR

// typography
export enum TYPOGRAPHY_CLASS {
	body2Bold = 'k-typography-body-2-bold',
	body2 = 'k-typography-body-2',
	body3Bold = 'k-typography-body-3-bold',
	body3 = 'k-typography-body-3'
}

// STATUS

export const COLORS_DEFAULT: Record<number, string> = {
	0: '#75C88C',
	1: '#188737',
	2: '#FF6E33',
	3: '#DD8EEA',
	4: '#A98EEA',
	5: '#75C88C',
	6: '#188737',
	7: '#A98EEA'
};

export const STATUS_DEFAULT_BACKGROUND_COLOR = 'var(--blue-light)';
export const STATUS_DEFAULT_TEXT_COLOR = 'var(--violet)';
export const STATUS_DEFAULT_TITLE = 'Неизвестно';

// TABLES
export const TIMESHEET_MONTH_FLAGS: { [key: string]: { name: string; shortName: string; color: string } } = {
	'0': {
		name: 'Январь',
		shortName: 'Янв',
		color: '#53D6F2'
	},
	'1': {
		name: 'Февраль',
		shortName: 'Фев',
		color: '#53D6F2'
	},
	'2': {
		name: 'Март',
		shortName: 'Мар',
		color: 'var(--green-7)'
	},
	'3': {
		name: 'Апрель',
		shortName: 'Апр',
		color: 'var(--green-7)'
	},
	'4': {
		name: 'Май',
		shortName: 'Май',
		color: 'var(--green-7)'
	},
	'5': {
		name: 'Июнь',
		shortName: 'Июн',
		color: '#ECD400'
	},
	'6': {
		name: 'Июль',
		shortName: 'Июл',
		color: '#ECD400'
	},
	'7': {
		name: 'Август',
		shortName: 'Авг',
		color: '#ECD400'
	},
	'8': {
		name: 'Сентябрь',
		shortName: 'Сен',
		color: 'var(--orange-2)'
	},
	'9': {
		name: 'Октябрь',
		shortName: 'Окт',
		color: 'var(--orange-2)'
	},
	'10': {
		name: 'Ноябрь',
		shortName: 'Ноя',
		color: 'var(--orange-2)'
	},
	'11': {
		name: 'Декабрь',
		shortName: 'Дек',
		color: '#53D6F2'
	}
};
