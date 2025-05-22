<template>
	<div class="ui-textarea">
		<div
			class="label"
			:class="[labelClass ?? labelClass]"
			v-if="label"
		>
			{{ label }}
		</div>
		<div class="text-area">
			<div
				v-if="$slots['left-icon']"
				class="input__icon input__icon--left"
				@click="clickLeftIconHandler"
				ref="refLeftIcon"
			>
				<slot name="left-icon" />
			</div>
			<div
				class="area-edit"
				:contenteditable="true"
				:style="{ height: height }"
				:placeholder="placeholder"
				@blur="leaveInput(modelValue, required, $event)"
				@input="updateValue"
				@change="emit('change', $event)"
				@keypress="onKeypress"
				@paste="onPaste($event)"
				@focus="focusHadle"
				ref="area"
				@keydown.enter="updateValue"
			></div>
			<div
				v-if="$slots['right-icon']"
				class="input__icon input__icon--right"
				ref="refRightIcon"
			>
				<slot
					name="right-icon"
					:clearHandler="clear"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import {
		supportFileImages,
		supportFileText,
		supportFileVideo,
		supportFileExcel,
		supportFileEmoji,
		supportFilePdf,
		supportFileWord
	} from '~/const/chat';
	import defaultSvg from '~/assets/svg/icon/chat/attach.svg';
	import excelSvg from '~/assets/svg/icon/chat/excel.svg';
	import wordSvg from '~/assets/svg/icon/chat/word.svg';
	import pdfSvg from '~/assets/svg/icon/chat/pdf.svg';
	import txtSvg from '~/assets/svg/icon/chat/txt.svg';
	import { useNotificationStore } from '~/store/notification.store';
	import { NotiticationChat } from '~/const/notification';
	import { getFileExtension } from '~/helpers/file';

	const emit = defineEmits([
		'update:modelValue',
		'input',
		'change',
		'blur',
		'paste',
		'focus',
		'clear',
		'clickLeftIconHandler'
	]);

	const props = withDefaults(
		defineProps<{
			placeholder?: string;
			name?: string;
			required?: boolean;
			error?: boolean;
			modelValue?: string | number;
			addedFile?: any;
			label?: string;
			cyrillicOnly?: boolean;
			keyPressCodeDisabled?: number[];
			labelClass?: string;
			disabled?: boolean;
			maxWidth?: string;
			height?: string;
			borderRadius?: string;
			autoresize?: { isEnabled: boolean; maxHeight: number; minHeight: number };
			sendMessageHandler?: CallableFunction;
		}>(),
		{
			maxWidth: '250px',
			height: '110px',
			borderRadius: '12px'
		}
	);

	const notificationStore = useNotificationStore();
	const refLeftIcon = ref(null);
	const refRightIcon = ref(null);
	const isRequired = ref(false);
	const isFocused = ref(false);
	const area = ref(null);

	const checkRequire = (value: string | number, required: boolean | undefined) => {
		turnRequired(!String(value).length && required);
	};

	const turnRequired = (value: boolean | undefined) => (isRequired.value = value!);

	const updateValue = (event: Event) => {
		const target = event.target as HTMLInputElement;
		emit('update:modelValue', target.childNodes);
		emit('input', target.childNodes);

		if (!event?.shiftKey && event?.keyCode === 13 && props.sendMessageHandler) {
			props.sendMessageHandler(clear);
		}
	};

	function clear() {
		setTimeout(() => {
			area.value.textContent = '';
			emit('clear', '');
			setHeight();
		});
	}

	async function onPaste(event: ClipboardEvent) {
		event.stopPropagation();
		event.preventDefault();

		const clipboardData = event.clipboardData || window.clipboardData;
		const pastedData = clipboardData.getData('Text');

		if (pastedData) {
			createBlock(pastedData);
		}

		emit('paste', event);
		if (props.cyrillicOnly) {
			const regex = /^[а-яА-ЯёЁ\s-]+$/;
			navigator.clipboard.readText().then((res: string) => {
				const copyText = res;
				if (!regex.test(copyText)) {
					clear();
					return false;
				}
			});
		}
	}

	function onlyCyrillic(evt: KeyboardEvent) {
		const regex = /^[а-яА-ЯёЁ\s-]+$/;
		const key = evt.key;
		if (!regex.test(key)) {
			evt.preventDefault();
			return false;
		}
	}

	function onKeypress(evt: KeyboardEvent) {
		if (props.cyrillicOnly) {
			onlyCyrillic(evt);
		}

		if (props.keyPressCodeDisabled && props.keyPressCodeDisabled.includes(evt.keyCode)) {
			evt.preventDefault();
		}
	}

	const leaveInput = (value: string | number | undefined, required: boolean | undefined, event: Event) => {
		emit('blur', event);
		// checkRequire(value, required);
		isFocused.value = false;
	};

	const focusHadle = (event: Event) => {
		emit('focus', event);
		isFocused.value = true;
	};

	const autoResizeHandler = () => {
		if (!props.autoresize?.isEnabled) return;

		if (area.value !== null) {
			area.value.addEventListener('input', setHeight);
		}
	};

	const setHeight = () => {
		const minHeight = props.autoresize.minHeight;
		const maxHeight = props.autoresize.maxHeight;

		area.value.style.setProperty('min-height', '0');
		area.value.style.setProperty('min-height', constrain(area.value.scrollHeight, minHeight, maxHeight) + 'px');
	};

	const constrain = (n: number, low: number, high: number) => {
		return Math.max(Math.min(n, high), low);
	};

	const clickLeftIconHandler = () => {
		emit('clickLeftIconHandler', '');
	};

	const paddingTextArea = computed(
		() => `17px ${refRightIcon.value?.clientWidth}px 17px ${refLeftIcon.value?.clientWidth}px`
	);

	watch(
		() => props.addedFile,
		() => {
			const fileExtension = getFileExtension(props.addedFile.file.name);

			switch (true) {
				case supportFileText.includes(props.addedFile.file.type):
					createFile(props.addedFile.file, txtSvg);
					break;
				case supportFilePdf.includes(fileExtension):
					createFile(props.addedFile.file, pdfSvg);
					break;
				case supportFileWord.includes(fileExtension):
					createFile(props.addedFile.file, wordSvg);
					break;
				case supportFileExcel.includes(fileExtension):
					createFile(props.addedFile.file, excelSvg);
					break;
				case supportFileImages.includes(props.addedFile.file.type):
					createImage(props.addedFile.file);
					break;
				case supportFileEmoji.includes(props.addedFile.file.type):
					createEmoji(props.addedFile.file);
					break;
				case supportFileVideo.includes(props.addedFile.file.type):
					createVideo(props.addedFile.file);
					break;
				default:
					notificationStore.addNewAlert(NotiticationChat.ERROR_UNSUPPORTED_FORMAT);
					break;
			}
			setTimeout(() => {
				emit('input', area.value.childNodes);
			});
		},
		{ deep: true }
	);

	const createBlock = (text: string) => {
		const textEl = document.createElement('div');
		textEl.innerHTML = text;
		textEl.isCustomBlock = true;
		insertImage(textEl);
	};

	const createEmoji = (emoji) => {
		const imageEl = document.createElement('img');
		imageEl.src = URL.createObjectURL(emoji);
		imageEl.className = 'chat__textarea-emoji';
		imageEl.customAttrs = emoji;
		insertImage(imageEl);
		URL.revokeObjectURL(emoji);
	};

	const createImage = (image) => {
		const imageEl = document.createElement('img');
		imageEl.src = URL.createObjectURL(image);
		imageEl.className = 'chat__textarea-file';
		imageEl.customAttrs = image;
		setTimeout(() => {
			insertImage(imageEl);
		});
		URL.revokeObjectURL(image);
	};

	const createVideo = (video) => {
		const videoEl = document.createElement('video');
		videoEl.setAttribute('controls', '');
		videoEl.className = 'chat__textarea-file';
		videoEl.src = URL.createObjectURL(video);
		videoEl.customAttrs = video;
		setTimeout(() => {
			insertImage(videoEl);
		});
		URL.revokeObjectURL(video);
	};

	const createFile = (item: any, fileIcon = defaultSvg) => {
		const file = document.createElement('img');
		file.src = fileIcon;
		file.customAttrs = item;
		file.className = 'chat__textarea-file';
		setTimeout(() => {
			insertImage(file);
		});
	};

	function insertImage(image) {
		const selection = window.getSelection();

		if (
			selection.rangeCount === 0 /* нет выделения */ ||
			// выделение лежит не в #conteneditable
			!area.value.contains(selection.getRangeAt(0).commonAncestorContainer)
		) {
			// вставляем в конец элемента #editable
			area.value.appendChild(image);
		} else {
			let range = selection.getRangeAt(0);
			// сжимаем range в его правый конец

			range.collapse(false);
			// вставляем картинку
			range.insertNode(image);

			// делаем, чтобы курсор был после вставленной картинки
			selection.removeAllRanges();
			range.setStartAfter(image);
			selection.addRange(range);
			// скролл области при переносе строки на новую
			area.value.scrollTo(0, image.offsetTop - 10);
		}
		setHeight();
	}

	const blurCheck = (event) => {
		event.preventDefault();
	};

	onMounted(() => {
		autoResizeHandler();
		if (refRightIcon.value) {
			refRightIcon.value.addEventListener('mousedown', blurCheck);
		}
	});

	onUnmounted(() => {
		if (refRightIcon.value) {
			refRightIcon.value.removeEventListener('mousedown', blurCheck);
		}
	});
</script>
<style lang="scss">
	.chat__textarea-file {
		height: 25px;
		margin-top: 5px;
		margin-right: 4px;
		vertical-align: bottom;
	}

	.chat__textarea-emoji {
		height: 22px;
		margin-right: 4px;
		margin-top: 5px;
		vertical-align: bottom;
	}
</style>
<style scoped lang="scss">
	.ui-textarea {
		display: flex;
		flex-direction: column;
		gap: 5px;

		.text-area {
			display: flex;
			align-items: flex-end;
			width: 100%;
			border: 1px solid var(--gray-2);
			background-color: var(--white);
			border-radius: v-bind(borderRadius);
			overflow: hidden;
		}

		.input__icon {
			&--right {
				position: absolute;
				bottom: 0px;
				right: 0px;
				padding: 0px 15px 5px 0px;
			}

			&--left {
				position: absolute;
				left: 0px;
				padding: 0px 0px 4px 10px;
			}
		}

		.area-edit {
			@include body-2;
			color: var(--black);
			height: 100%;
			width: 100%;
			outline: none;
			border: 0px;
			border-radius: 12px;
			padding: v-bind(paddingTextArea);
			resize: none;
			overflow-y: auto;

			&::placeholder {
				@include body-2;
				color: var(--dark-gray);
			}
			&:focus::placeholder {
				color: var(--dark-gray);
			}

			&_password {
				font-size: 18px;
			}

			&:read-only {
				cursor: default;
			}
		}
	}

	*::-webkit-scrollbar {
		width: 0px; /* в основном для вертикальных полос прокрутки */
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
