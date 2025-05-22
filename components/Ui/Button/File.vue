<template>
	<div
		class="ui-file field-load"
		:class="{ 'field-load_warning': warning && !saveFile, 'field-load_dragging': isDragging }"
		@dragover.prevent="dragover"
		@dragleave="dragleave"
		@drop.prevent="drop"
	>
		<div
			class="ui-file__area-load"
			v-if="$slots.areaLoad"
			@dragover.prevent.stop="mouseEnterHandler"
		>
			<slot name="areaLoad" />
			<div
				class="area"
				@dragover.prevent.stop="dragover"
				@dragleave.stop="dragleave"
				@drop.prevent.stop="drop"
				v-show="isHover"
			></div>
			<div
				class="flare"
				v-if="isLoading"
			></div>
		</div>
		<div
			class="area-load-empty"
			v-else
		>
			<div :class="['field-load_empty', `field-load_empty_${orientation}`]">
				<slot name="title"></slot>
				<slot name="subtitle"></slot>
				<label
					class="btn__load"
					:for="`uploadForm_File_${unicId}`"
				>
					<div class="wrapper">
						<div class="click-area"></div>
						<div
							class="flare"
							v-if="isLoading"
						></div>
						<div v-if="$slots.customBtn">
							<slot name="customBtn" />
						</div>
						<UiButton
							v-else
							:label="label"
							:color="ButtonType.variant6"
							:customStyle="{ minWidth: '193px' }"
						>
							<template #before>
								<UiIcon
									name="attach"
									color="var(--white)"
								/>
							</template>
						</UiButton>
					</div>
				</label>
			</div>
			<div
				class="field-load_filled"
				v-if="isNeedFilledInfo"
			>
				<div class="content">
					<div
						class="title"
						v-if="fileName"
					>
						{{ fileName }}
					</div>
					<div
						class="subtitle"
						v-if="fileSize"
					>
						размер файла {{ fileSize }}
					</div>
				</div>
				<UiIcon
					name="cross"
					class="btn__delete"
					@click="deleteFileHandler"
				/>
			</div>
		</div>
		<input
			:value="file"
			class="form-upload__input"
			:id="`uploadForm_File_${unicId}`"
			type="file"
			name="file_name"
			:accept="acceptFiles"
			aria-describedby="hint"
			:multiple="true"
			@input="changeHandler"
			:disabled="isLoading"
		/>
	</div>
</template>

<script setup lang="ts">
	import { formatBytes, getFileExtension } from '~/helpers/file';
	import { ButtonType } from '~/interfaces/ui';
	import { useNotificationStore } from '~/store/notification.store';

	const props = withDefaults(
		defineProps<{
			file?: any;
			warning?: boolean;
			isNeedFilledInfo?: boolean;
			isNeedPosibleDragAndDropFile?: boolean;
			orientation?: 'vertical' | 'horizontal';
			maxSize?: number | null;
			borderRadiusDragableArea?: string;
			label?: string;
			acceptFiles?: string;
			isLoading?: boolean;
		}>(),
		{
			isNeedFilledInfo: false,
			isNeedPosibleDragAndDropFile: true,
			orientation: 'horizontal',
			maxSize: null,
			borderRadiusDragableArea: '20px',
			label: 'Загрузить',
			acceptFiles: '.pdf,.jpg,.svg,.jpeg,.png,.word,.txt,.webp,.excel'
		}
	);

	const unicId = useId();

	const notificationStore = useNotificationStore();
	const emits = defineEmits(['load']);
	const reader = ref<FileReader | null>(null);
	const isDragging = ref(false);
	const isHover = ref(false);
	const file = ref([]);
	const saveFile = ref<{ file: any; base64: any } | null>(null);

	const fileSize = computed(() => {
		if (saveFile.value) {
			return formatBytes(saveFile.value.file.size);
		}
	});
	const fileName = computed(() => {
		if (saveFile.value) {
			return saveFile.value.file.name;
		}
	});

	const mouseLeaveHandler = () => {
		isHover.value = false;
	};

	const mouseEnterHandler = () => {
		isHover.value = true;
	};

	const deleteFileHandler = () => {
		file.value = [];
		saveFile.value = null;
		submitSavedFile();
	};
	const changeHandler = (e) => {
		const files = e.target.files[0];

		if (checkFileAccept(files)) {
			return;
		}

		if (files && reader.value) {
			saveFile.value = { file: files, base64: null };
			reader.value.readAsDataURL(files);
		}
	};
	const dragover = (e) => {
		if (!props.isNeedPosibleDragAndDropFile) return;
		isDragging.value = true;
	};
	const dragleave = () => {
		if (!props.isNeedPosibleDragAndDropFile) return;
		isDragging.value = false;
	};
	const drop = (e) => {
		mouseLeaveHandler();
		if (!props.isNeedPosibleDragAndDropFile || !reader.value) return;

		isDragging.value = false;

		const files = e.dataTransfer.files[0];
		if (checkFileAccept(files)) {
			return;
		}

		saveFile.value = { file: files, base64: null };
		reader.value.readAsDataURL(files);
	};

	const submitSavedFile = () => {
		emits('load', saveFile.value);
	};

	const checkFileAccept = (files?: File) => {
		if (props.acceptFiles && files && !props.acceptFiles.includes(getFileExtension(files.name))) {
			notificationStore.addNewAlert(`Формат не поддерживается, разрешённые форматы: ${props.acceptFiles}`, 4000);
			return true;
		}

		if (props.maxSize && files && props.maxSize < files.size) {
			notificationStore.addNewAlert(`Размер файла превышает ${formatBytes(props.maxSize)}`, 3000);
			file.value = [];
			return true;
		}
		return false;
	};

	onMounted(() => {
		reader.value = new FileReader();

		reader.value.addEventListener('load', () => {
			saveFile.value = {
				file: saveFile.value?.file,
				base64: reader.value && reader.value.result
			};
			submitSavedFile();
		});

		saveFile.value = props.file;
	});

	watch(
		() => props.file,
		() => {
			saveFile.value = props.file;
		}
	);
</script>

<style scoped lang="scss">
	.ui-file {
		position: relative;

		&__area-load {
			.area {
				position: absolute;
				top: 0;
				z-index: 5;
				left: 0;
				right: 0;
				bottom: 0;
			}
		}

		input {
			display: none;
		}
	}

	.field-load {
		border: 2px dashed transparent;
		border-radius: v-bind(borderRadiusDragableArea);

		&_dragging {
			cursor: grab !important;
			border: 2px dashed var(--gray-2);
		}

		&_warning {
			border: 2px dashed var(--var-warning);
		}

		&_empty {
			min-height: 39px;
			display: flex;
			align-items: center;
			border-radius: v-bind(borderRadiusDragableArea);
			gap: $g-3;
			justify-content: space-between;

			&_vertical {
				flex-direction: column;
				align-items: flex-start;
			}

			&_horizontal {
			}

			.btn {
				&__load {
					border-radius: v-bind(borderRadiusDragableArea);
					color: var(--var-blue-50);
					border: 1px solid var(--var-blue-50);
					cursor: pointer;

					.wrapper {
						position: relative;
						width: 100%;
						height: 100%;

						.click-area {
							width: 100%;
							height: 100%;
							position: absolute;
							z-index: 1;
						}

						&:hover {
							.ui-button {
								transition: all linear 0.35s;
								opacity: 0.9;
							}
						}
					}
				}
			}

			.content {
				display: flex;
				flex-direction: column;
				width: 100%;

				.title {
					color: var(--var-black-100);
				}

				.subtitle {
					color: var(--var-gray-200);
				}
			}
		}

		&_filled {
			min-height: 39px;
			background: var(--var-white-400);

			display: flex;
			align-items: center;
			padding: $p-0 $p-1;
			border-radius: $br-1;
			gap: $g-3;
			justify-content: space-between;

			.btn {
				&__delete {
					cursor: pointer;
				}
			}

			.content {
				display: flex;
				flex-direction: column;
				width: 100%;

				.title {
					color: var(--var-black-100);
				}

				.subtitle {
					color: var(--var-gray-200);
				}
			}
		}

		@media (max-width: $md) {
			&_empty {
				flex-direction: column;
				text-align: center;
			}
		}
	}

	.flare {
		position: absolute;
		opacity: 0.65;
		top: 0;
		height: 100%;
		width: 15%;
		transform: skewX(-45deg); // Наклон
		left: -10%;
		background: linear-gradient(90deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.4));
		animation: flareAnimation 1s infinite ease-out; // Время и тип анимации можно менять
		z-index: 9999;
	}

	@keyframes flareAnimation {
		0% {
			left: -10%;
		}
		100% {
			left: 110%;
		}
	}
</style>
