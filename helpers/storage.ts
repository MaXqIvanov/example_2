import CookieNameSpace from '~/const/cookie';

// token methods
export const addTokenInStorage = (key: string, value: string, validTo?: Date) => {
	const runtimeConfig = useRuntimeConfig();

	if (runtimeConfig.public.tokenStorage === 'localStorage') {
		localStorage.setItem(key, value);
		useCookie(CookieNameSpace.getAccessToken).value = 'token in localStorage.';
		validTo && setExpiredToken(validTo);
		return;
	}

	useCookie(key, {
		...(validTo && { expires: new Date(validTo) })
	}).value = value;
	validTo && setExpiredToken(validTo);
};

const setExpiredToken = (validTo: Date) => {
	useCookie(CookieNameSpace.tokenExpired).value = `${new Date(validTo).getTime()}`;
};

export const checkForNeedUpdateToken = () => {
	const currentTime = new Date().getTime();

	const StorageTime = Number(useCookie(CookieNameSpace.tokenExpired).value) || 0;
	if (
		useCookie(CookieNameSpace.getAccessToken).value &&
		StorageTime - currentTime < CookieNameSpace.refreshTokenExpired
	) {
		return true;
	}
	return false;
};

export const getTokenFromStorage = (key: string) => {
	const runtimeConfig = useRuntimeConfig();

	if (runtimeConfig.public.tokenStorage === 'localStorage') {
		return localStorage.getItem(key);
	}

	return useCookie(key).value;
};

export const removeTokenFromStorage = (key: string) => {
	const runtimeConfig = useRuntimeConfig();

	if (runtimeConfig.public.tokenStorage === 'localStorage') {
		localStorage.removeItem(key);
	}
	useCookie(CookieNameSpace.tokenExpired).value = null;

	useCookie(key).value = null;
};

// end token methods
