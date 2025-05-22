export const config = {
	baseURL: process.env.BASE_URL,
	staticUrl: process.env.STATIC_URL,
	localesURL: process.env.LOCALES_URL,
	appVersion: process.env.APP_VERSION,
	tokenStorage: process.env.TOKEN_STORAGE || 'sessionStorage',
	tokenYMap: process.env.YMAP_TOKEN || '',
	rocketChatLink: process.env.ROCKET_CHAT_LINK,
	isNeedVisibleErrorInConsole: process.env.IS_NEED_VISIBLE_ERROR_IN_CONSOLE,
	isNeedVisibleLogReqInConsole: process.env.IS_NEED_VISIBLE_LOG_REQ_IN_CONSOLE,
	isPwaEnabled: process.env.IS_PWA_ENABLED,
	dataTelegramLogin: process.env.DATA_TELEGRAM_LOGIN,
	NUXT_BUILD_TIMESTAMP: ''
};
