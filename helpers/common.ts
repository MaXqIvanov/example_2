export const replaceArrayItem = <T>(array: T[], newValue: T, condition: (el: T) => boolean) => {
	if (array && newValue) {
		const index = array.findIndex((el) => condition(el));
		if (index > -1) {
			array.splice(index, 1, newValue);
		}
	}
};
