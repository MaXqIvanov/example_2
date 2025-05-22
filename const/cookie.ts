namespace CookieNameSpace {
	export const getAccessToken = 'access_token';
	export const tokenExpired = 'access_token_expired';
	export const refreshTokenExpired = 43200000; // 12h
	export const regexJWT = /^[A-Za-z0-9_-]{2,}(?:\.[A-Za-z0-9_-]{2,}){2}$/;
}

export default CookieNameSpace;
