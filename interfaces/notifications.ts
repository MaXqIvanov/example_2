import type { AlertsTypes, NotificationTypes } from '~/const/notification';

export type TNotification = {
	id: string;
	title: string;
	message: string;
	mobileTargetPage: string;
	readedByRecipient: boolean;
	created: string;
};

export type TAlert = { id: number; message: string; type: AlertsTypes };
