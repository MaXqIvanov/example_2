import { USER_SETTINGS_UI_FIELDS } from '~/const/profile';
import { useProfileStore } from './profile.store';

export const useChatSupportStore = defineStore('chatSupport', () => {
	const profileStore = useProfileStore();
	const chatSupport = ref<any>(null);
	const chatWidget = ref<any>(null);
	const isShowWidget = ref<boolean>(false);

	function $reset() {}

	const getRocketChat = () => {
		(function (w, d, s, u) {
			w.RocketChat = function (c) {
				w.RocketChat._.push(c);
			};
			w.RocketChat._ = [];
			w.RocketChat.url = u;

			let h = d.getElementsByTagName(s)[0],
				j: any = d.createElement(s);

			j.async = true;
			j.onload = () => {
				const rocketChatWidget = document.getElementsByClassName('rocketchat-widget')[0];
				if (rocketChatWidget) {
					chatWidget.value = rocketChatWidget;
					if (window?.RocketChat) {
						chatSupport.value = window.RocketChat.livechat;

						if (!isShowWidget.value) {
							chatWidget.value.style.display = 'none';
							chatSupport.value.hideWidget();
						} else {
							chatSupport.value.showWidget();
						}
						chatSupport.value.onWidgetShown(() => {
							chatWidget.value.style.display = 'block';
						});
						chatSupport.value.onWidgetHidden(() => {
							chatWidget.value.style.display = 'none';
						});
						chatSupport.value.onChatStarted(() => {
							isShowWidget.value = true;
							chatSupport.value.showWidget();
						});
						chatSupport.value.onQueuePositionChange(() => {
							console.log('onQueuePositionChange');
						});
						chatSupport.value.onPrechatFormSubmit(() => {
							console.log('onPrechatFormSubmit');
						});
						chatSupport.value.onAssignAgent(() => {
							console.log('onAssignAgent');
						});
						chatSupport.value.onAgentStatusChange(() => {
							console.log('onAgentStatusChange');
						});
					}
				}
			};
			j.src = useRuntimeConfig().public.rocketChatLink;

			if (h.parentNode) {
				h.parentNode.insertBefore(j, h);
			}
		})(window, document, 'script', 'https://rchat.ndigital.tech/livechat');
	};

	const showWidgetChat = () => {
		isShowWidget.value = true;
		chatSupport.value.showWidget();
		profileStore.updateProfileSettins(true, USER_SETTINGS_UI_FIELDS.IsShowWidgetChat, 1000);
		setTimeout(() => {
			chatSupport.value.maximizeWidget();
		});
	};

	const hiddenWidgetChat = () => {
		isShowWidget.value = false;
		chatSupport.value.hideWidget();
		profileStore.updateProfileSettins(false, USER_SETTINGS_UI_FIELDS.IsShowWidgetChat, 1000);
	};

	return {
		chatSupport,
		isShowWidget,
		$reset,
		getRocketChat,
		showWidgetChat,
		hiddenWidgetChat
	};
});
