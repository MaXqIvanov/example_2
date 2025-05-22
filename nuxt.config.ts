// https://nuxt.com/docs/api/configuration/nuxt-config
import { config } from './runtime.confit';
import path from 'path';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import iconsJson from './public/icons.json';

const isVipVersion = process.env.APP_VERSION === 'VIP';

export default defineNuxtConfig({
	experimental: {
		payloadExtraction: true, // Включить извлечение полезной нагрузки
		componentIslands: true, // Экспериментальная островная архитектура
		asyncContext: true, // Асинхронный контекст
		noVueServer: false, // Оптимизация SSR
		sharedPrerenderData: true, // Совместное использование данных предварительного рендеринга
		scanPageMeta: true // Включаем сканирование метаданных
	},
	devtools: { enabled: true },
	routeRules: {
		'/authorization/sign-in': {},
		'/': { redirect: '/bots' }
	},
	css: ['@/css/app.scss'],
	components: {
		dirs: ['~/components/']
	},
	runtimeConfig: {
		public: config
	},
	nitro: {
		compressPublicAssets: true
	},
	// Оптимизация сборки
	build: {
		transpile: ['lodash-es']
	},
	vite: {
		build: {
			cssCodeSplit: true, // Разделение CSS по страницам
			minify: 'terser', // Минификация
			rollupOptions: {
				output: {
					manualChunks: (id) => {
						if (id.includes('node_modules')) {
							return 'vendor';
						}
						if (id.includes('pages/')) {
							return 'pages'; // Чанки по страницам
						}
					}
				}
			}
		},
		assetsInclude: [],
		css: {
			devSourcemap: true, // Sourcemaps для CSS в development
			preprocessorOptions: {
				scss: {
					additionalData: '@import "@/css/variables.scss"; @import "@/css/mixins.scss";'
				}
			}
		},
		plugins: [
			createSvgIconsPlugin({
				// https://github.com/vbenjs/vite-plugin-svg-icons
				iconDirs: [path.resolve(process.cwd(), './assets/svg/icon')],
				symbolId: '[name]',
				inject: 'body-first'
			})
		]
	},
	app: {
		head: {
			meta: [
				{
					name: 'viewport',
					content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'
				}
			],
			link: [
				{
					rel: 'icon',
					href: isVipVersion ? '/favicon-vip.ico' : '/favicon.ico'
				}
			],
			htmlAttrs: {
				'data-theme': isVipVersion ? 'dark' : 'light'
			},
			script: []
		}
	},
	pwa: {
		manifest: {
			name: 'Pinnx',
			short_name: 'Pinnx',
			description: 'Pinnx - crypto bot',
			theme_color: '#fff',
			display: 'standalone',
			scope: '/',
			id: '/',
			prefer_related_applications: true,
			icons: { ...iconsJson }.icons,
			screenshots: [
				{
					src: 'windows11/LargeTile.scale-125.png',
					type: 'image/png',
					sizes: '388x388'
				},
				{
					src: 'windows11/LargeTile.scale-400.png',
					type: 'image/png',
					sizes: '1240x1240',
					form_factor: 'wide'
				}
			]
		},
		workbox: {
			navigateFallback: null,
			cleanupOutdatedCaches: true,
			runtimeCaching: [
				{
					urlPattern: ({ request }) => request.mode === 'navigate',
					handler: 'NetworkFirst',
					options: {
						cacheName: 'html-pages',
						networkTimeoutSeconds: 3,
						expiration: {
							maxEntries: 10,
							maxAgeSeconds: 60 * 60 * 24 * 30 // 30 дней
						},
						cacheableResponse: {
							statuses: [0, 200]
						}
					}
				},
				{
					urlPattern: '.*\\.(png|jpg|jpeg|webp|svg|gif|ico)(\\?.*)?',
					handler: 'CacheFirst',
					method: 'GET',
					options: {
						cacheName: 'images',
						// Кэшировать только при реальном использовании
						cacheableResponse: { statuses: [0, 200] },
						expiration: {
							maxEntries: 100,
							maxAgeSeconds: 60 * 60 * 24 * 30
						}
					}
				},
				{
					urlPattern: '/locales/.*',
					handler: 'CacheFirst',
					options: {
						cacheName: `translations-cache-${config.NUXT_BUILD_TIMESTAMP}`,
						expiration: {
							maxEntries: 3, // Максимум 3 записи в кэше
							maxAgeSeconds: 1 // 30 дней
						}
					}
				}
			]
		},
		devOptions: {
			enabled: false,
			type: 'module'
		}
	},
	modules: [
		'@pinia/nuxt', // https://nuxt.com/modules/swiper
		'nuxt-swiper',
		'nuxt-qrcode',
		'@vite-pwa/nuxt',
		'@nuxtjs/i18n',
		'~/modules/build-cache'
	],

	i18n: {
		/* module options */
		compilation: {
			strictMessage: true
		},
		lazy: true,
		langDir: 'locales',
		strategy: 'prefix_except_default',
		locales: [
			// {
			// 	code: 'en',
			// 	iso: 'en-US',
			// 	name: 'English',
			// 	file: 'en.json'
			// },
			{
				code: 'ru',
				iso: 'ru-RU',
				name: 'Русский',
				file: 'ru.json'
			}
		],
		detectBrowserLanguage: {
			useCookie: true,
			redirectOn: 'root'
		},
		defaultLocale: 'ru'
	},

	swiper: {
		styleLang: 'scss'
	},
	plugins: [
		'plugins/vue3-popper', // https://valgeirb.github.io/vue3-popper/guide/getting-started.html#global
		'~/plugins/error-handler'
	]
});
