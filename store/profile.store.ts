import type { IProfileUser, IRegisterReq } from '~/interfaces/profile';
import { useBaseStore } from './base.store';
import CookieNameSpace from '~/const/cookie';
import RouterNameSpace from '~/const/router';
import {
	addTokenInStorage,
	checkForNeedUpdateToken,
	getTokenFromStorage,
	removeTokenFromStorage
} from '~/helpers/storage';
import { USER_SETTINGS_UI_FIELDS } from '~/const/profile';
import { getObjectByString } from '~/helpers';
import { useChatSupportStore } from './chatSupport.store';
import { useNotificationStore } from './notification.store';
import { AlertsTypes } from '~/const/notification';

export const useProfileStore = defineStore('profile', () => {
	const nuxtApp = useNuxtApp();
	const baseStore = useBaseStore();
	const chatSupportStore = useChatSupportStore();
	const notification = useNotificationStore();

	const isGet401Error = ref(false);
	const isLoggedIn = ref(CookieNameSpace.regexJWT.test(useCookie(CookieNameSpace.getAccessToken).value || ''));
	const profileInfo = ref<IProfileUser | null>(null);
	// const profileSettings = computed(() => {
	// 	if (profileInfo.value?.person.userUiSettings) {
	// 		return JSON.parse(profileInfo.value?.person.userUiSettings);
	// 	}
	// });
	const loadingEvents = reactive({
		btnSignIn: false,
		btnUpdateProfile: false,
		btnUpdateOrganizationLogo: false,
		btnUpdateProfileLogo: false
	});
	const timeoutsList = reactive<Record<string, NodeJS.Timeout>>({});

	const router = useRouter();

	function $reset() {
		profileInfo.value = null;
	}

	const getProfile = async () => {
		const token = getTokenFromStorage(CookieNameSpace.getAccessToken);
		const { data, status } = await useCustomFetch<IProfileUser>('/api/Auth/profile', {
			headers: {
				token: token
			}
		});

		if (status.value === 'success') {
			profileInfo.value = data.value;
			// setProfileSettings();
		}

		// try {
		// 	if (checkForNeedUpdateToken()) {
		// 		await refreshHandler();
		// 	}
		// } catch {}
	};

	const checkToken = async () => {
		const token = getTokenFromStorage(CookieNameSpace.getAccessToken);
		if (!token) return;
		const { data, status } = await useCustomFetch<IProfileUser>('/api/Auth/check', {
			headers: {
				token: token
			}
		});

		if (status.value === 'success') {
			try {
				if (checkForNeedUpdateToken()) {
					await refreshHandler();
				}
			} catch {}
		}
	};

	/**
	 * function for set default settings app
	 */
	const setProfileSettings = () => {
		if (!profileInfo.value?.person?.userUiSettings) return;
		const options = getObjectByString(profileInfo.value?.person.userUiSettings);
		if (options.isShowWidgetChat !== undefined) chatSupportStore.isShowWidget = options.isShowWidgetChat;
	};

	const updateProfile = async (profile: IProfileUser) => {
		const { data, status } = await useCustomFetch<IProfileUser>(
			'/api/Employees/update',
			{
				method: 'put',
				body: { ...profile },
				watch: false
			},
			{
				setLoading: (load: boolean) => {
					loadingEvents.btnUpdateProfile = load;
				}
			}
		);

		if (status.value === 'success') {
			profileInfo.value = data.value;
			notification.addNewAlert('Данные профиля успешно обновлены', 2500, AlertsTypes.SUCCESS);
		}
	};

	const updateProfileSettins = async (settings: any, field: USER_SETTINGS_UI_FIELDS, timeOutDelay = 2500) => {
		return;
		const saveSettings = { ...profileSettings.value };
		saveSettings[field] = settings;
		if (profileInfo.value?.person) {
			profileInfo.value.person = { ...profileInfo.value.person, userUiSettings: JSON.stringify(saveSettings) };

			if (timeoutsList['update-profile']) {
				clearTimeout(timeoutsList['update-profile']);
			}

			timeoutsList['update-profile'] = setTimeout(async () => {
				const { data, status } = await useCustomFetch<IProfileUser>(
					'/api/api/Employees/update',
					{
						method: 'put',
						body: profileInfo.value,
						watch: false,
						lazy: true,
						onResponse: ({ response }) => {
							baseStore.isLoading = false;
							if (response.status >= 400 && !profileInfo.value) return;
							profileInfo.value!.person.userUiSettings = data.value?.person.userUiSettings;
						}
					},
					{
						isDisabledErrroMessage: true
					}
				);

				if (status.value === 'success' && profileInfo.value) {
					profileInfo.value.person.userUiSettings = data.value?.person.userUiSettings;
				}
			}, timeOutDelay);
		}
	};

	const deleteProfileSetting = async (field: USER_SETTINGS_UI_FIELDS, timeOutDelay = 2500) => {
		return;
		const saveSettings = { ...profileSettings.value };
		delete saveSettings[field];

		if (profileInfo.value?.person) {
			profileInfo.value.person = { ...profileInfo.value.person, userUiSettings: JSON.stringify(saveSettings) };

			if (timeoutsList['update-profile']) {
				clearTimeout(timeoutsList['update-profile']);
			}

			timeoutsList['update-profile'] = setTimeout(async () => {
				const { data, status } = await useCustomFetch<IProfileUser>(
					'/api/Employees/update',
					{
						method: 'put',
						body: profileInfo.value,
						watch: false,
						lazy: true,
						onResponse: ({ response }) => {
							baseStore.isLoading = false;
							if (response.status >= 400 && !profileInfo.value) return;
							profileInfo.value!.person.userUiSettings = data.value?.person.userUiSettings;
						}
					},
					{
						isDisabledErrroMessage: true
					}
				);

				if (status.value === 'success' && profileInfo.value) {
					profileInfo.value.person.userUiSettings = data.value?.person.userUiSettings;
				}
			}, timeOutDelay);
		}
	};

	const authUser = async ({ login, password }: any) => {
		loadingEvents.btnSignIn = true;
		const { data, status } = await useCustomFetch<any>(
			'/api/Auth/login',
			{
				method: 'post',
				query: { login, password },
				watch: false
			},
			{ isDisabledLogoutAction: true }
		);

		if (status.value === 'success' && data.value) {
			data.value?.token && addTokenInStorage(CookieNameSpace.getAccessToken, data.value.token, data.value?.dateEnd);
			isLoggedIn.value = true;
			setTimeout(async () => {
				router.push(RouterNameSpace.routerRedirectIsLoggedIn);
			});
		} else if (true) {
		}
		loadingEvents.btnSignIn = false;
	};

	const authUserTG = async (user: any) => {
		loadingEvents.btnSignIn = true;
		const { data, status } = await useCustomFetch<any>('/api/Auth/login-tlgr', {
			method: 'post',
			query: { data: JSON.stringify(user) },
			body: {},
			watch: false
		});

		if (status.value === 'success' && data.value) {
			data.value?.token && addTokenInStorage(CookieNameSpace.getAccessToken, data.value.token, data.value?.dateEnd);
			isLoggedIn.value = true;
			setTimeout(async () => {
				// getProfile();
				router.push(RouterNameSpace.routerRedirectIsLoggedIn);
			});
		}
		loadingEvents.btnSignIn = false;
	};

	const registerUser = async ({ phone, inviteCode, accept }: any) => {
		const { data, status } = await useCustomFetch<IRegisterReq>('/api/Auth/register', {
			method: 'post',
			query: { phone, ...(inviteCode && { inviteCode: inviteCode }), accept: accept },
			watch: false
		});

		if (status.value === 'success' && data.value) {
		}

		return { data: data.value, status: status.value };
	};

	const userRecoveryStep1 = async ({ phone }: any) => {
		const { data, status } = await useCustomFetch<IRegisterReq>('/api/Auth/reset-password', {
			method: 'post',
			query: { phone },
			watch: false
		});

		if (status.value === 'success' && data.value) {
		}

		return { data: data.value, status: status.value };
	};

	const userRecoveryRegisterStep1 = async () => {
		const { data, status } = await useCustomFetch<IRegisterReq>(
			'/api/Auth/reset-password-registered',
			{
				method: 'post',
				watch: false
			},
			{
				isDisabledShowMsgSuccess: true
			}
		);

		if (status.value === 'success' && data.value) {
		}

		return { data: data.value, status: status.value };
	};

	const userRecoveryStep2 = async ({ phone, password, code }: any) => {
		const { data, status } = await useCustomFetch<IRegisterReq>('/api/Auth/set-new-password', {
			method: 'post',
			body: { phone, newPassword: password, code },
			watch: false
		});

		if (status.value === 'success' && data.value) {
		}

		return { data: data.value, status: status.value };
	};

	const logoutHandler = async (errorMessage?: string) => {
		try {
			isGet401Error.value = true;
			const token = getTokenFromStorage(CookieNameSpace.getAccessToken);
			isGet401Error.value = false;
			const { data, status } = await useCustomFetch<any>('/api/Auth/logout', {
				method: 'post',
				server: false,
				query: { token },
				onResponseError: () => {}
			});

			if (status.value) {
				removeTokenFromStorage(CookieNameSpace.getAccessToken);
				isLoggedIn.value = false;
				router.push(RouterNameSpace.routerRedirectNoLoggedIn);

				setTimeout(() => {
					const resetStore = useResetStore();
					resetStore.all();
				});
			}
		} catch {
			isLoggedIn.value = false;
			if (errorMessage) {
				useNotificationStore().addNewAlert(errorMessage);
			}
		}
	};

	const refreshHandler = async () => {
		const token = getTokenFromStorage(CookieNameSpace.getAccessToken);

		await useCustomFetch<any>(
			'/api/Auth/refresh',
			{
				method: 'post',
				watch: false,
				server: false,
				retry: false,
				body: JSON.stringify(token),
				onResponse: ({ response }) => {
					baseStore.isLoading = false;
					if (response.status >= 400) return;
					response._data.token &&
						addTokenInStorage(CookieNameSpace.getAccessToken, response._data.token, response._data?.dateEnd);
				}
			},
			{
				isDisabledErrroMessage: true
			}
		);
	};

	return {
		profileInfo,
		isLoggedIn,
		loadingEvents,
		isGet401Error,
		$reset,
		updateProfileSettins,
		deleteProfileSetting,
		getProfile,
		checkToken,
		authUser,
		registerUser,
		userRecoveryStep1,
		userRecoveryRegisterStep1,
		userRecoveryStep2,
		logoutHandler,
		refreshHandler,
		authUserTG,
		updateProfile
	};
});
