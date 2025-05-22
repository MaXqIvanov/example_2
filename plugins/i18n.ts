import type { Router } from 'vue-router';
import type { Composer } from 'vue-i18n'; // Используем тип Composer

export default defineNuxtPlugin(async (nuxtApp) => {
	const router: Router = nuxtApp.$router as Router;
	const i18n: Composer = nuxtApp.$i18n as Composer;

	// Генерация уникального хэша версии для кэша
	const getCacheVersion = () => {
		if (process.env.NODE_ENV === 'production')
			return useRuntimeConfig().public.NUXT_BUILD_TIMESTAMP || Date.now().toString();
		return 'dev';
	};

	// Функция для загрузки переводов
	const loadTranslations = async (locale: string) => {
		const cacheVersion = getCacheVersion();
		const cacheName = `translations-cache-${cacheVersion}`;
		try {
			// Проверяем кэш в Service Worker
			const cache = await caches.open(cacheName);
			const cachedResponse = await cache.match(`/locales/${locale}.json`);

			if (cachedResponse) {
				const translations = await cachedResponse.json();

				i18n.setLocaleMessage(locale, translations.default);
				return;
			}

			// Пытаемся загрузить переводы с сервера
			// const response = await fetch(`${useRuntimeConfig().public.localesURL}/locales/${locale}.json`);
			// if (response.ok) {
			// 	const translations = await response.json();
			// 	i18n.setLocaleMessage(locale, translations);

			// 	// Кэшируем через Workbox
			// 	await cache.put(`/locales/${locale}.json`, new Response(JSON.stringify(translations)));
			// 	return;
			// }

			// Если загрузка с сервера не удалась, используем локальные переводы
			const localTranslations = await import(`~/i18n/locales/${locale}.json`);
			i18n.setLocaleMessage(locale, localTranslations.default || localTranslations);

			// Кэшируем локальные переводы в Workbox
			if (process.env.NODE_ENV === 'production') {
				await cache.put(`/locales/${locale}.json`, new Response(JSON.stringify(localTranslations)));
			}
		} catch (error) {
			console.error(`Failed to load translations for ${locale}:`, error);

			// Если всё провалилось, используем локальные переводы
			const localTranslations = await import(`~/i18n/locales/${locale}.json`);
			i18n.setLocaleMessage(locale, localTranslations.default || localTranslations);
		}
	};

	// Загружаем переводы для текущей локали
	await loadTranslations(i18n.locale.value);

	// Обработка SSR-запросов
	nuxtApp.hook('app:created', async () => {
		if (process.server) {
			await loadTranslations(i18n.locale.value);
		}
	});

	// Слушаем изменение локали
	i18n.onLanguageSwitched = async (oldLocale: string, newLocale: string) => {
		await loadTranslations(newLocale);
	};

	// Переопределяем router.push для поддержки локалей
	const originalPush = router.push;
	router.push = (path: string) => {
		if (!i18n || !i18n.locale || !i18n.defaultLocale) {
			return originalPush(path);
		}

		const locale = i18n.locale.value;
		const defaultLocale = i18n.defaultLocale;

		if (locale === undefined || defaultLocale === undefined) {
			return originalPush(path);
		}

		const hasLocalePrefix = path.startsWith(`/${locale}/`) || path === `/${locale}`;
		const prefixedPath = hasLocalePrefix || locale === defaultLocale ? path : `/${locale}${path}`;

		return originalPush(prefixedPath);
	};
});
