const timeDefault = 10 * 1000; // 10 sec
export const getCashedDataAfterTime = (key: string, timeDelay?: number) => {
	const nuxtApp = useNuxtApp();
	const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key];

	if (!data) return;

	const expirationDate = new Date(data.fetchedAt);
	expirationDate.setTime(expirationDate.getTime() + (timeDelay || timeDefault));
	const isExpired = expirationDate.getTime() < Date.now();

	if (isExpired) {
		return;
	}

	return data;
};
