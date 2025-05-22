import { COLORS_DEFAULT } from '~/const/ui';

// we can use useId function - default function in nuxt for get unic id value;
export function getUniqueIdSimple() {
	return Date.now();
}

export const getValueByMask = (string: string, mask: string, clearSymbol?: string): string => {
	let result = '';
	let count = 0;
	if (string) {
		const arrayValue = clearSymbol ? string.replaceAll(clearSymbol, '') : string.toString().split('');
		const arrayMask = mask.toString().split('');

		for (let i = 0; i < arrayMask.length; i++) {
			if (i < arrayValue.length + count) {
				if (arrayMask[i] === '#' || arrayMask[i] === '_' || arrayMask[i] === ' ') {
					result = result + arrayValue[i - count];
				} else {
					result = result + arrayMask[i];
					count++;
				}
			}
		}
	}

	return result;
};

export const getPhoneByMaskV2 = (indentificator: string, phoneCodes: string): string => {
	let resultIndentificatore = indentificator;

	let pattern: string;

	if (phoneCodes !== '+7') {
		pattern = '(   )          ';
	} else {
		pattern = '(   )          ';
	}

	const phone = getValueByMask(indentificator, pattern);
	const postfix = pattern.substring(phone.length, pattern.length);

	resultIndentificatore = phoneCodes ? `${phoneCodes} ` + phone : `` + phone;

	return resultIndentificatore;
};

export const getObjectWithValue = (object: Object) => {
	return Object.entries(object).reduce((a, [k, v]) => (v ? ((a[k] = v), a) : a), {});
};

export const getObjectByString = (value: string) => {
	return JSON.parse(value);
};

export function cloneObject(o: Record<string, any>) {
	const gdcc = '__getDeepCircularCopy__';
	if (o !== Object(o)) {
		return o; // primitive value
	}

	let set = gdcc in o,
		cache = o[gdcc],
		result;
	if (set && typeof cache == 'function') {
		return cache();
	}
	// else
	o[gdcc] = function () {
		return result;
	}; // overwrite
	if (o instanceof Array) {
		result = [];
		for (let i = 0; i < o.length; i++) {
			result[i] = cloneObject(o[i]);
		}
	} else {
		result = {};
		for (let prop in o)
			if (prop != gdcc) result[prop] = cloneObject(o[prop]);
			else if (set) result[prop] = cloneObject(cache);
	}
	if (set) {
		o[gdcc] = cache; // reset
	} else {
		delete o[gdcc]; // unset again
	}

	return result;
}

export const getRandomColor = (function () {
	let value = 0;
	let timeOutHandler: null | NodeJS.Timeout = null;
	return function getRandomColor() {
		value++;
		if (value > Object.keys(COLORS_DEFAULT).length - 1) {
			value = 0;
		}
		if (!timeOutHandler) {
			timeOutHandler = setTimeout(() => {
				value = 0;
				timeOutHandler = null;
			});
		}
		return COLORS_DEFAULT[value];
	};
})();

/**
 * function for focus input field
 * @param inputField
 */
export function focusCampo(inputField: HTMLInputElement | any) {
	if (inputField != null && inputField.value.length != 0) {
		if (inputField.createTextRange) {
			let FieldRange = inputField.createTextRange();
			FieldRange.moveStart('character', inputField.value.length);
			FieldRange.collapse();
			FieldRange.select();
		} else if (inputField.selectionStart || inputField.selectionStart == '0') {
			let elemLen = inputField.value.length;
			inputField.selectionStart = elemLen;
			inputField.selectionEnd = elemLen;
			setTimeout(() => {
				inputField.focus();
			});
		}
	} else {
		inputField.focus();
	}
}
