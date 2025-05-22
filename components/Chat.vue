<template>
	<div class="chat">
		<div class="chat__users">
			<div class="header">
				<TypographyKTypographyBody1 fontWeight="bold">Список</TypographyKTypographyBody1>
				<!-- <UiButtonIcon
					padding="8.5px"
					@click="searchShow(false)"
					v-if="isSearchHidden"
				>
					<UiIcon
						:name="'search'"
						:height="16"
						:width="16"
					/>
				</UiButtonIcon> -->
				<UiInput
					v-model="searchByUser"
					max-width="180px"
					height="40px"
				>
					<template #right-icon>
						<UiButtonIcon
							padding="5.5px -10px"
							background="transparent"
							@click="searchByUsersHandler"
						>
							<UiIcon
								:name="'search'"
								:height="16"
								:width="16"
							/>
						</UiButtonIcon>
					</template>
				</UiInput>
			</div>
			<div class="content">
				<PagesVacanciesQuestionUserCard
					v-for="(user, index) in users"
					:key="user.id"
					:user="user"
					:class="{ active: user.id === userIncoming.id }"
					@click="chooseUserHandler(user, index)"
				></PagesVacanciesQuestionUserCard>
			</div>
		</div>
		<div class="chat__messages">
			<div class="header">
				<div class="user-info">
					<UiAvatarUser
						:status="userIncoming.status"
						:img="userIncoming?.photos ? userIncoming?.photos[0]?.url : null"
						size="70x70"
					/>
					<div class="wrapper">
						<TypographyKTypographyBody1
							color="var(--black)"
							fontWeight="bold"
						>
							{{ userIncoming.name }}
						</TypographyKTypographyBody1>
						<TypographyKTypographyBody3 color="var(--dark-gray)">
							Был(а) в сети {{ userIncoming.lastActive }}
						</TypographyKTypographyBody3>
					</div>
				</div>
				<div class="actions"></div>
			</div>
			<div class="content">
				<div class="messages">
					<div
						v-if="messages"
						v-for="(message, index) in messages"
						:key="message.id"
						class="wrapper"
					>
						<TypographyKTypographyBody4
							font-type="bold"
							class="date"
							color="var(--blue-dark)"
							v-if="getDate(message.date) !== getDate(messages[index - 1]?.date)"
						>
							{{ getDate(message.date) }}
						</TypographyKTypographyBody4>
						<PagesVacanciesQuestionMessageCard
							:class="{
								message__outgoing: checkIsOutGoing(message),
								'message__change-user': message.userId !== messages[index - 1]?.userId && index !== 0,
								message__unread: !message.isRead
							}"
							:message="message"
							:currentUser="checkIsOutGoing(message) ? userOutGoing : userIncoming"
						/>
					</div>
				</div>
			</div>
			<UiButtonFile
				class="textarea"
				@load="loadFileHandler"
			>
				<template #areaLoad>
					<UiTextAreaChat
						v-model="message"
						:addedFile="loadFile"
						@input="inputHandler"
						height="60px"
						border-radius="20px"
						:autoresize="{ isEnabled: true, maxHeight: 95, minHeight: 60 }"
						:sendMessageHandler="sendMessageHandler"
					>
						<template #left-icon>
							<UiButtonFile
								class="ui-file-with-icon"
								@load="loadFileHandler"
								:is-need-posible-drag-and-drop-file="false"
							>
								<template #customBtn>
									<UiButtonIcon background="transparent">
										<UiIcon
											:name="'attach'"
											folder="chat"
										/>
									</UiButtonIcon>
								</template>
							</UiButtonFile>
						</template>
						<template #right-icon="props">
							<div class="actions">
								<UiPopoverEmoji @select="selectEmojiHandler" />
								<UiButton
									:color="ButtonType.primary"
									button-padding="8px 22px"
									@click="sendMessageHandler(props.clearHandler)"
								>
									<UiIcon
										:name="'send'"
										folder="chat"
										color="var(--white)"
									/>
								</UiButton>
							</div>
						</template>
					</UiTextAreaChat>
				</template>
			</UiButtonFile>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { getDateInLocaleString, getDayAsString } from '~/helpers/date';
	import type { IQuestionMessage, IQuestionUsers } from '~/interfaces/question';
	import { ButtonType } from '~/interfaces/ui';

	const emit = defineEmits(['chooseUser', 'sendMessage']);

	const props = withDefaults(
		defineProps<{
			users: IQuestionUsers[];
			userIncoming: IQuestionUsers;
			userOutGoing: any;
			messages: IQuestionMessage[] | null;
		}>(),
		{}
	);

	const message = ref<any[]>([]);
	const loadFile = ref<{ file: File; base64: string } | null>(null);
	const searchByUser = ref('');

	const checkIsOutGoing = (message: IQuestionMessage) => {
		return props.userIncoming.id !== message.userId;
	};

	const getDate = (date: string) => {
		return `${getDayAsString(date)} ${getDateInLocaleString(date, { showTime: false })}`;
	};

	const chooseUserHandler = (user: IQuestionUsers, index: number) => {
		emit('chooseUser', user, index);
	};

	const loadFileHandler = (file: { file: any; base64: any }) => {
		loadFile.value = file;
	};

	const inputHandler = (value: any[]) => {
		message.value = [...value];
	};

	const selectEmojiHandler = async (emoji: { url: string; name: string; type: string }) => {
		let blob = await fetch(emoji.url).then((r) => r.blob());
		const newFile = new File([blob], emoji.name, { type: 'emoji' });
		loadFileHandler({ file: newFile, base64: null });
	};

	const searchByUsersHandler = () => {
		console.log(searchByUser.value);
	};

	const sendMessageHandler = (actionAfterUpdate: () => void) => {
		if (!message.value.find((item) => item.textContent || item.customAttrs || item.isCustomBlock)) return;
		const data: any[] = [];
		message.value.forEach((item) => {
			if (item.isCustomBlock) {
				const childs = [...item.childNodes];
				childs.forEach((item2) => {
					if (item2.textContent === '') data.push(item2.customAttrs || undefined);
					else {
						data.push(item2.textContent || item2.customAttrs);
					}
				});
			} else {
				data.push(item.textContent || item.customAttrs);
			}
		});

		emit('sendMessage', data);

		actionAfterUpdate();
		message.value = [];
	};
</script>

<style lang="scss">
	:root {
		--chat-header-height: 111px;
		--chat-max-height: 84vh;
		--chat-actions-margin: 32px;
		--chat-max-content: calc(
			var(--chat-max-height) - var(--chat-header-height) - calc(var(--chat-actions-margin) * 2 + 70px)
		);

		@media (max-width: $laptop) {
			--chat-actions-margin: 20px;
		}
	}
</style>
<style scoped lang="scss">
	.chat {
		display: grid;
		grid-template-columns: min-content 1fr;
		min-height: var(--chat-max-height);
		max-height: var(--chat-max-height);
		box-shadow: 0px 10px 30px 0px var(--box-shadow-default);
		word-break: break-all;

		&__messages {
			position: relative;
			border-radius: 0px 15px 15px 0px;
			background-color: white;

			.textarea {
				position: absolute;
				bottom: 0px;
			}

			.actions {
				display: flex;
				align-items: center;
				gap: 15px;
			}

			.ui-file {
				margin: var(--chat-actions-margin);
				width: calc(100% - var(--chat-actions-margin) * 2);
			}

			.ui-file-with-icon {
				margin: 0px;
			}

			.ui-input {
				height: 60px;
			}

			.header {
				display: flex;
				justify-content: space-between;
				padding: 0px 20px 0px 47px;
				height: var(--chat-header-height);
				border-bottom: 1px solid var(--blue-light-2);

				.user-info {
					display: flex;
					align-items: center;
					gap: 25px;

					.wrapper {
						display: flex;
						flex-direction: column;
						gap: 5px;
					}
				}
			}

			.content {
				position: relative;
				overflow-y: auto;
				margin-top: 10px;
				padding: 0px 28px 0px 28px;
				max-height: var(--chat-max-content);
				min-height: var(--chat-max-content);

				.messages {
					display: flex;
					gap: 10px;
					flex-direction: column;

					.wrapper {
						display: flex;
						flex-direction: column;

						.date {
							align-self: center;
							border: 1px solid var(--blue-light-2);
							width: fit-content;
							padding: 5.5px 10px;
							border-radius: 50px;
							margin-bottom: 17px;
							margin-top: 12px;
						}
					}
				}
			}
		}

		&__users {
			background-color: var(--blue-light-12);
			border-radius: 15px 0px 0px 15px;
			overflow: hidden;
			border-right: 1px solid var(--blue-light-2);

			.header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1px solid var(--blue-light-2);
				height: var(--chat-header-height);
				padding: 0px 25px;
			}
			.content {
				height: 100%;
				max-height: calc(84vh - 110px);
				overflow-y: auto;
				overflow-x: hidden;

				.active {
					background-color: var(--white);
					box-shadow: 0px 4px 10px 0px #1e0c3e0d;
				}
			}
		}
	}

	*::-webkit-scrollbar {
		width: 5px; /* в основном для вертикальных полос прокрутки */
		height: 5px; /* в основном для горизонтальных полос прокрутки */
	}

	*::-webkit-scrollbar-thumb {
		/* плашка-бегунок */
		background-color: var(--orange);
		border-radius: 4px;
		border: 1px solid var(--orange);
	}

	*::-webkit-scrollbar-track {
		/* фон */
		background: var(--blue-6);
	}
</style>
