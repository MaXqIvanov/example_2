import type { UseFetchOptions } from '#app';
import CookieNameSpace from '~/const/cookie';
import { ERRORS_TRANSLATE } from '~/const/errors';
import { AlertsTypes, TIMEDEAD_DEFAULT_FOR_ALERT } from '~/const/notification';
import { getTokenFromStorage } from '~/helpers/storage';
import { useBaseStore } from '~/store/base.store';
import { useNotificationStore } from '~/store/notification.store';
import { useProfileStore } from '~/store/profile.store';

export const useCustomFetch = async <T>(request: string, opts: UseFetchOptions<T>, customOpts?: CustomOpts) => {
	const baseStore = useBaseStore();

	const token = getTokenFromStorage(CookieNameSpace.getAccessToken);

	if (token) {
		opts = {
			...opts,
			headers: {
				...opts?.headers,
				Authorization: `Bearer ${token}`
			}
		};
	}

	return useFetch(request, {
		onRequest: async (res) => {
			baseStore.isLoading = true;
			CustomOptsUseage(customOpts, TypeEvents.onRequest);
		},
		onResponse: async (res) => {
			if (res.response.ok && !customOpts?.isDisabledShowMsgSuccess && res.response._data?.msg) {
				const notification = useNotificationStore();
				notification.addNewAlert(res.response._data?.msg, 4000, AlertsTypes.SUCCESS);
			}

			baseStore.isLoading = false;
			CustomOptsUseage(customOpts, TypeEvents.onResponse);
		},
		onRequestError: async () => {
			baseStore.isLoading = false;
			CustomOptsUseage(customOpts, TypeEvents.onRequestError);
		},
		onResponseError: async (error) => {
			baseStore.isLoading = false;
			CustomOptsUseage(customOpts, TypeEvents.onResponseError);

			if (error.response?.status === 401 && !customOpts?.isDisabledLogoutAction) {
				const user = useProfileStore();
				if (user.isLoggedIn) await user.logoutHandler(ERRORS_TRANSLATE[error.response?.status] || '');

				return;
			}

			if (customOpts?.isDisabledErrroMessage) return;

			const notification = useNotificationStore();

			const error_key = error.response?.statusText.replaceAll(' ', '_').toLocaleLowerCase();

			let errorFromBack = null;

			let countLetter = 0;

			const dataLength = error.response?._data?.msg?.length || error.response?._data?.length;
			const msg = error.response?._data?.msg || error.response?._data;
			let reverIndex = dataLength;
			for (let index = 0; index < dataLength; index++) {
				if (countLetter > 3) {
					errorFromBack = msg;
					break;
				}
				if (/[а-яА-ЯЁё]/.test(msg?.[index])) {
					countLetter++;
				}
				reverIndex = reverIndex - 1 > 0 ? reverIndex - 1 : null;
				if (reverIndex !== null && /[а-яА-ЯЁё]/.test(msg?.[reverIndex])) {
					countLetter++;
				}
				if (index > 5) break;
			}

			notification.addNewAlert(
				errorFromBack ||
					ERRORS_TRANSLATE[error_key] ||
					ERRORS_TRANSLATE[error.response?.status] ||
					ERRORS_TRANSLATE.DEFAULT,
				TIMEDEAD_DEFAULT_FOR_ALERT
			);
		},
		...opts
	});
};

enum TypeEvents {
	onRequest = 'onRequest',
	onResponse = 'onResponse',
	onRequestError = 'onRequestError',
	onResponseError = 'onResponseError'
}

type CustomOpts = {
	setLoading?: (load: boolean) => void;
	isDisabledErrroMessage?: boolean;
	isDisabledLogoutAction?: boolean;
	isDisabledShowMsgSuccess?: boolean;
};

const CustomOptsUseage = (customOpts?: CustomOpts, type?: keyof typeof TypeEvents) => {
	switch (true) {
		case !!customOpts?.setLoading:
			if (type === TypeEvents.onRequest) {
				customOpts.setLoading(true);
			} else {
				customOpts.setLoading(false);
			}

		default:
			break;
	}
};
