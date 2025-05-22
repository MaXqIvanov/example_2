const timeout: Record<string, any> = {};
export const delay = (key: string, arg: { func: CallableFunction }, delay: number = 500) => {
	if (timeout?.[key]) {
		clearTimeout(timeout[key]);
	}
	timeout[key] = setTimeout(() => {
		arg.func();
	}, delay);
};
