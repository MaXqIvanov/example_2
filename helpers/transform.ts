export const getUserName = (name: string, surname: string, patronymic: string): string => {
	let result = '';
	if (surname) result += surname;
	if (name) result += ` ${name}`;
	if (patronymic) result += ` ${patronymic}`;
	return result;
};

export const getValueWithPlusOrMinus = (value: string | number) => {
	if (`${value}`.startsWith('-') || value == '0') {
		return value;
	} else return `+${value}`;
};
