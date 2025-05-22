<template>
	<div
		class="ui-select"
		ref="parentRef"
		@click="openDropDown"
	>
		<UiInput
			v-model="selectItem"
			:label="label"
			:readonly="true"
			:placeholder="placeholder"
			:maxWidth="maxWidth"
			:height="height"
			:labelClass="labelClass"
			:error="error"
			:input-wrapper-special-style="{
				borderBottomLeftRadius: isOpenDropDown ? '0px' : undefined,
				borderBottomRightRadius: isOpenDropDown ? '0px' : undefined
			}"
			:required="required"
			:disabled="disabled"
			:disabledText="disabledText"
		>
			<template #right-icon>
				<UiIcon
					name="arrow"
					width="12"
					height="12"
				/>
			</template>
		</UiInput>
		<div
			class="list"
			v-if="isOpenDropDown"
			@click.stop
			:style="{
				position: positionList?.position,
				width: positionList?.width,
				top: positionList?.top,
				left: positionList?.left
			}"
		>
			<div
				v-if="isNeedSearch"
				class="search"
			>
				<UiInput
					v-model="search"
					max-width="none"
					height="34px"
					placeholder="поиск..."
					:inputWrapperSpecialStyle="{ borderRadius: '8px' }"
					:keysSubmit="[13]"
					@keySubmitActions="searchHandler"
					@blur="searchHandlerBlur"
				/>
			</div>
			<div
				v-if="!items?.size"
				class="item"
			>
				<span>Список пуст</span>
			</div>
			<div
				v-else
				class="item"
				v-for="[key, value] in items"
				@click="selectItemHandler(key)"
				:class="{ item_active: checkActiveHandler(key) }"
			>
				<UiCheckBox
					v-if="type === 'checkbox'"
					:model-value="checkActiveHandler(key)"
					@click.prevent
				></UiCheckBox>
				<span> {{ theObjectToBeDisplayed ? value?.[theObjectToBeDisplayed] : value }}</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	// todo добавить поддержку для объектов
	const emit = defineEmits(['update:modelValue', 'blur', 'change', 'searchInputHandler', 'searchInputHandlerBlur']);

	const props = withDefaults(
		defineProps<{
			type?: 'default' | 'checkbox';
			placeholder?: string;
			label?: string;
			labelClass?: string;
			maxWidth?: string;
			height?: string;
			items: Map<string | number, string> | null;
			modelValue: Array<string | number> | Array<{ [key: string]: string | number }>;
			maxHeightList?: string;
			error?: { status: boolean; msg?: string | undefined };
			objectField?: string;
			required?: boolean;
			disabled?: boolean;
			disabledText?: string;
			positionList?: string;
			theObjectToBeDisplayed?: string;
			isNeedSearch?: boolean;
		}>(),
		{
			maxWidth: '250px',
			maxHeightList: '250px',
			height: '50px',
			type: 'checkbox',
			positionList: 'absolute'
		}
	);

	const parentRef = ref(null);
	const search = ref('');
	const isOpenDropDown = ref(false);
	const openDropDown = () => {
		if (props.disabled) {
			return;
		}
		isOpenDropDown.value = true;
	};

	const closeDropDown = () => {
		isOpenDropDown.value = false;
		emit('blur', selectItem.value);
	};

	const checkActiveHandler = (item: number | string) => {
		if (props.objectField) {
			return !!props.modelValue.find((value) => value?.[props.objectField] === item);
		}
		return props.modelValue?.includes(item);
	};

	const searchHandler = () => {
		emit('searchInputHandler', search.value);
	};

	const searchHandlerBlur = () => {
		emit('searchInputHandlerBlur', search.value);
	};

	const selectItemHandler = (value: string | null | number) => {
		if (props.objectField) {
			if (!!props.modelValue.find((item) => item?.[props.objectField] === value)) {
				emit(
					'update:modelValue',
					props.modelValue.filter((item) => item?.[props.objectField] !== value)
				);
				return;
			}
			emit('update:modelValue', [...props.modelValue, { [props.objectField]: value }]);

			return;
		}

		if (props.modelValue.includes(value)) {
			emit(
				'update:modelValue',
				props.modelValue.filter((item) => item !== value)
			);
			emit(
				'change',
				props.modelValue.filter((item) => item !== value)
			);
			return;
		}
		emit('update:modelValue', [...props.modelValue, value]);
		emit('change', [...props.modelValue, value]);
	};

	const selectItem = computed({
		get() {
			if (props.objectField) {
				return props.modelValue.map((item) => props.items?.get(item?.[props.objectField])).join(',');
			}
			if (Array.isArray(props.modelValue)) {
				if (props.theObjectToBeDisplayed) {
					return props.modelValue.map((item) => props.items?.get(item)?.[props.theObjectToBeDisplayed]).join(', ');
				}

				return props.modelValue.map((item) => props.items?.get(item)).join(',');
			}
			return null;
		},
		set(value) {
			emit('update:modelValue', value);
		}
	});

	const positionList = computed(() => {
		if (isOpenDropDown.value) {
			if (props.positionList === 'fixed') {
				const clientRect = parentRef.value?.getBoundingClientRect();
				const width = clientRect.width;
				const left = clientRect.left;
				const top = clientRect.top + clientRect.height;
				return {
					position: 'fixed',
					top: `${top}px`,
					left: `${left}px`,
					width: `${width}px`
				};
			} else {
				return {
					position: 'absolute',
					top: '100%',
					left: '0%',
					width: '100%'
				};
			}
		}
	});

	watch(isOpenDropDown, (value) => {
		if (value) {
			setTimeout(() => {
				document.addEventListener('click', clickOutSide);
			});
		} else document.removeEventListener('click', clickOutSide);
	});

	const clickOutSide = () => {
		closeDropDown();
	};
</script>

<style scoped lang="scss">
	.ui-select {
		position: relative;
		caret-color: transparent;

		.list {
			position: absolute;
			background: var(--white);
			transform: translate(0px, -7%);
			z-index: 1000;
			//box-shadow: 0px 10px 50px 0px #12114533;
			border-radius: 20px;
			padding: 20px;
			border: 1px solid var(--gray-100);
			border-top: 0;
			border-top-right-radius: 0;
			border-top-left-radius: 0;
			display: flex;
			flex-direction: column;
			gap: 15px;
			max-height: v-bind(maxHeightList);
			overflow-y: auto;

			.search {
				margin-left: -6px;
				margin-right: -6px;
				padding-bottom: 5px;
			}

			.item {
				display: flex;
				align-items: center;
				@include body-2;
				opacity: 0.8;
				cursor: pointer;

				.ui-checkbox {
					gap: 11px;
				}

				&:hover {
					opacity: 1;
				}

				&_active {
					color: var(--violet);
					font-weight: 600;
					opacity: 1;
				}
			}
		}
	}
</style>
