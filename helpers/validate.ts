export enum VALIDATE_RULES {
	toFrom = 'toFrom',
	email = 'email',
	required = 'required',
	password = 'password',
	equal = 'equal',
	validateInn = 'validateInn',
	min = 'min',
	minLength = 'minLength'
}
export const VALIDATE_RULES_OBJECT = [VALIDATE_RULES.toFrom, VALIDATE_RULES.equal, VALIDATE_RULES.min];
let validateErrorText: string | undefined = '';
export function validator(
	value: string | boolean | { value1: number | string; value2: number | string; [field: string]: string | number },
	rules: VALIDATE_RULES[],
	field?: string,
	customErrorText?: string,
	isDontNeedCheckField?: boolean
) {
	validateErrorText = customErrorText;
	const validationResult: Array<{ status: boolean; msg?: string }> = [];
	rules.forEach((el) => validate(value, el, field, isDontNeedCheckField));

	function validate(
		value: string | boolean | number | { [field: string]: string | number },
		rule: VALIDATE_RULES,
		field?: string,
		isDontNeedCheckField?: boolean
	) {
		let currentValue: string | boolean | number | { [field: string]: string | number } = '';
		switch (true) {
			case Array.isArray(value):
				currentValue = value.length;
				break;
			case typeof value === 'object':
				currentValue = field && !isDontNeedCheckField ? (field in value ? value[field] : value?.value1) : value;
				break;
			case typeof value === 'boolean':
				currentValue = Number(value);
				break;
			default:
				currentValue = value;
				break;
		}

		switch (true) {
			case rule === 'equal' && typeof currentValue === 'object':
				validationResult.push(validateEqualValue(currentValue.value1, currentValue.value2));
				break;
			case rule === 'toFrom' && typeof currentValue === 'object':
				validationResult.push(validateFromTo(currentValue.value1, currentValue.value2));
				break;
			case rule === 'email':
				validationResult.push(validateOnEmail(currentValue as string));
				break;
			case rule === 'required':
				validationResult.push(validateOnRequired(currentValue as string));
				break;
			case rule === 'password':
				validationResult.push(validateOnPassword(currentValue as string));
				break;
			case rule === 'validateInn':
				validationResult.push(validateInn(currentValue as string));
				break;
			case rule === 'min' && typeof currentValue === 'object':
				validationResult.push(validateOnMin(currentValue.value1, currentValue.value2));
				break;
			case rule === 'minLength' && typeof currentValue === 'object':
				validationResult.push(validateMinLength(currentValue.value1, currentValue.value2));
				break;
		}
	}
	return validationResult;
}

function validateMinLength(value1: number | string, value2: number | string) {
	if (String(value1).length < (typeof value2 === 'number' ? value2 : value2.length)) {
		return {
			status: true,
			msg: validateErrorText || 'Проверьте правильность введённых данных'
		};
	}
	return {
		status: false
	};
}

function validateFromTo(value1: number | string, value2: number | string) {
	if (value1 > value2) {
		return {
			status: true,
			msg: 'Проверьте правильность введённых данных'
		};
	}
	return {
		status: false
	};
}

function validateOnMin(value1: number | string, value2: number | string) {
	const currentValue1 = Number(value1);
	const currentValue2 = Number(value2);
	if (currentValue1 < currentValue2) {
		return {
			status: true,
			msg: validateErrorText || `Минимальное значение - ${value2}`
		};
	}
	return {
		status: false
	};
}

function validateEqualValue(value1: number | string, value2: number | string) {
	if (value1 !== value2) {
		return {
			status: true,
			msg: 'Значение двух полей должны совпадать'
		};
	}
	return {
		status: false
	};
}

function validateOnEmail(value: string) {
	const emailRegex = /\S+@\S+\.\S+/;
	const result = emailRegex.test(value);

	if (result) {
		return { status: false };
	} else {
		return {
			status: true,
			msg: 'Проверьте email!'
		};
	}
}

function validateOnRequired(value: string | boolean) {
	let result = value;
	if (typeof value === 'string') {
		result = value.replaceAll(' ', '');
	}

	if (result || result === 0) {
		return { status: false };
	} else {
		return {
			status: true,
			msg: validateErrorText || 'error-field-is-required'
		};
	}
}

function validateOnPassword(password: string) {
	const letterRegex = /[a-zA-Z]/;
	const numberRegex = /[0-9]/;

	if (password.length < 4) {
		return {
			status: true,
			msg: 'Пароль должен быть больше 4 символов.'
		};
	}

	if (!numberRegex.test(password)) {
		return {
			status: true,
			msg: 'Должен содержать минимум 1 цифру.'
		};
	}

	return { status: false };
}

function validateInn(inn: string | number) {
	var result = false;
	if (typeof inn === 'number') {
		inn = inn.toString();
	} else if (typeof inn !== 'string') {
		inn = '';
	}
	if (!inn.length) {
		return {
			status: true,
			msg: 'ИНН пуст'
		};
	} else if (/[^0-9]/.test(inn)) {
		return {
			status: true,
			msg: 'ИНН может состоять только из цифр'
		};
	} else if ([10, 12].indexOf(inn.length) === -1) {
		return {
			status: true,
			msg: 'ИНН может состоять только из 10 или 12 цифр'
		};
	} else {
		var checkDigit = function (inn: any, coefficients: number[]) {
			let n = 0;
			for (let i in coefficients) {
				n += coefficients[i] * inn[i];
			}
			return parseInt(`${(n % 11) % 10}`);
		};
		switch (inn.length) {
			case 10:
				var n10 = checkDigit(inn, [2, 4, 10, 3, 5, 9, 4, 6, 8]);
				if (n10 === parseInt(inn[9])) {
					result = true;
				}
				break;
			case 12:
				var n11 = checkDigit(inn, [7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
				var n12 = checkDigit(inn, [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
				if (n11 === parseInt(inn[10]) && n12 === parseInt(inn[11])) {
					result = true;
				}
				break;
		}
		if (!result) {
			return {
				status: true,
				msg: 'Неправильное контрольное число'
			};
		}
	}
	return {
		status: false
	};
}
