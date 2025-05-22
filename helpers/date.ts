import { cloneObject } from '~/helpers';
import { getPluralizationText } from './i18n';

export const DAYS = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

export function convertDate(date: Date) {
	var yyyy = date.getFullYear().toString();
	var mm = (date.getMonth() + 1).toString();
	var dd = date.getDate().toString();

	var mmChars = mm?.split('');
	var ddChars = dd?.split('');

	return yyyy + '-' + (mmChars[1] ? mm : '0' + mmChars[0]) + '-' + (ddChars[1] ? dd : '0' + ddChars[0]);
}

export function getDateWithFormat(date: string) {
	const dateList = date.split('T');
	const dateCurrent = dateList[0] || '';
	const timeCurrent = dateList[1]?.split('.')[0] || '';
	return `${dateCurrent} ${timeCurrent}`;
}

export function getDaysInMonth(month: number, year: number) {
	return new Date(year, month, 0).getDate();
}

/**
 *
 * @param date format string - Mon May 13 2024 09:49:58 GMT+0300 (Moscow Standard Time), number - 0-6
 * @returns
 */
export const getDayAsString = (date: string | number) => {
	if (typeof date === 'number') return DAYS[date];
	return DAYS[new Date(date).getDay()];
};

/**
 *
 * @param time1 time format 00:00
 * @param time2 time format 00:00
 * @returns time format 00:00
 */
export function calculationTwoTime(time1: string, time2: string) {
	let [hours1, minutes1]: string[] = time1?.split(':');
	let [hours2, minutes2]: string[] = time2?.split(':');
	if (minutes1 === undefined) {
		minutes1 = '00';
	}
	if (minutes2 === undefined) {
		minutes2 = '00';
	}
	let hoursResult = Number(hours2) - Number(hours1);
	let minutesResult = Number(minutes2) - Number(minutes1);

	if (minutesResult < 0) {
		hoursResult -= 1;
	}
	if (hoursResult < 0) {
		hoursResult = 0;
	}
	if (minutesResult < 0) {
		if (hoursResult === 0) {
			minutesResult = 0;
		} else {
			minutesResult = 60 + minutesResult;
		}
	}
	let result = `${hoursResult > 9 ? hoursResult : `0${hoursResult}`}:${minutesResult > 9 ? minutesResult : `0${minutesResult}`}`;

	return result;
}

type DateOptions = {
	locale?: string;
	weekday?: 'long' | 'short' | 'narrow' | undefined;
	year?: 'numeric' | '2-digit' | undefined;
	month?: 'long' | 'short' | 'narrow' | 'numeric' | '2-digit' | undefined;
	day?: 'numeric' | '2-digit' | undefined | false;
	showTime?: boolean;
	showOnlyTime?: boolean;
	hour?: 'numeric' | '2-digit' | undefined;
	minute?: 'numeric' | '2-digit' | undefined;
};

export const getDateInLocaleString = (date?: string, options?: DateOptions) => {
	if (!date) return;
	const currentLocale = options?.locale ?? 'ru-RU';
	const needTime = options?.showTime ?? true;
	const isNeedOnlyTime = options?.showOnlyTime ?? false;

	if (isNeedOnlyTime)
		return new Date(date).toLocaleTimeString(currentLocale, {
			hour: needTime ? options?.hour ?? 'numeric' : undefined,
			minute: needTime ? options?.hour ?? 'numeric' : undefined
		});

	return new Date(date).toLocaleString(currentLocale, {
		weekday: options?.weekday ?? undefined,
		year: options?.year ?? '2-digit',
		month: options?.month ?? 'numeric',
		...(options?.day !== false && { day: options?.day ?? 'numeric' }),
		hour: needTime ? options?.hour ?? 'numeric' : undefined,
		minute: needTime ? options?.hour ?? 'numeric' : undefined
	});
};

export const calculateYears = (dateString: string) => {
	const today = new Date();
	const startDate = new Date(dateString);
	let years = today.getFullYear() - startDate.getFullYear();
	const month = today.getMonth() - startDate.getMonth();
	if (month < 0 || (month === 0 && today.getDate() < startDate.getDate())) {
		years--;
	}
	return years;
};

export const getJobExperience = <T extends { workedFrom: string; workedTo: string }>(experience: T[]) => {
	function monthDiff(d1: string, d2: string) {
		const date1 = new Date(d1);
		const date2 = new Date(d2);
		var m = (date1.getFullYear() - date2.getFullYear()) * 12 + (date1.getMonth() - date2.getMonth());
		if (date1.getDate() < date2.getDate()) --m;
		return m;
	}

	function dateCheck(from: string, to: string, check: string) {
		let fDate, lDate, cDate;
		fDate = Date.parse(from);
		lDate = Date.parse(to);
		cDate = Date.parse(check);

		if (cDate <= lDate && cDate >= fDate) {
			return true;
		}
		return false;
	}

	function calculateYearsOfExperience<T extends { workedFrom: string; workedTo: string }>(experiences: T[]) {
		if (!experiences) return 0;
		let months = 0;
		let now = new Date();
		let sorted = experiences
			.sort((a, b) => {
				return new Date(a.workedFrom) - new Date(b.workedFrom);
			})
			.map((experience) => {
				if (!experience.workedTo) experience.workedTo = now;
				return { workedFrom: experience.workedFrom, workedTo: experience.workedTo };
			});

		let workedFrom;
		let workedTo;
		for (let i in sorted) {
			let dif = 0;
			if (!workedTo && !workedFrom) {
				dif = monthDiff(sorted[i].workedFrom, sorted[i].workedTo);
				workedFrom = sorted[i].workedFrom;
				workedTo = sorted[i].workedTo;
			} else if (
				!dateCheck(workedFrom!, workedTo!, sorted[i].workedFrom) &&
				!dateCheck(workedFrom!, workedTo!, sorted[i].workedTo)
			) {
				dif = monthDiff(sorted[i].workedFrom, sorted[i].workedTo);
				workedTo = sorted[i].workedTo;
			} else if (dateCheck(workedFrom!, workedTo!, sorted[i].workedFrom)) {
				dif = monthDiff(workedTo!, sorted[i].workedTo);
				workedTo = sorted[i].workedTo;
			}
			months += dif;
		}

		return months / 12;
	}

	const currentValue = Math.abs(calculateYearsOfExperience(cloneObject(experience)));
	let result = '';

	if (currentValue > 110) return '-';

	const year = `${currentValue}`?.split('.')[0];
	let month: string | number = `${currentValue}`?.split('.')[1];
	const monthSplit = month?.split('');
	monthSplit?.splice(1, 0, '.');
	month = monthSplit?.join('');

	month = Math.ceil(Number(month));

	if (Number(year)) {
		result += `${year} ${getPluralizationText(Number(year), { empty: '', many: 'года', one: 'год', other: 'лет' })}`;
	}
	if (month) {
		result += ` ${Math.ceil(month)} ${getPluralizationText(month, { empty: 'месяцев', one: 'месяц', many: 'месяца', other: 'месяцев' })}`;
	}

	return result;
};

export function getAge(dateString: string) {
	let today = new Date();
	let birthDate = new Date(dateString);
	let age = today.getFullYear() - birthDate.getFullYear();
	let m = today.getMonth() - birthDate.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}
	return age;
}
