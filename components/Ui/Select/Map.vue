<template>
	<div
		class="ui-select"
		@click="openDropDown"
		ref="parentRef"
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
			:input-special-style="{ fontSize: '15px' }"
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
				class="item"
				v-for="[key, value] in items"
				@click="selectItemHandler(key, value)"
				:class="{
					item_active: modelValue === key,
					item_disabled: props.disabledItems && !props.disabledItems?.get(key)
				}"
			>
				{{ theObjectToBeDisplayed ? value[theObjectToBeDisplayed] : value }}
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	const emit = defineEmits(['update:modelValue', 'blur', 'change', 'searchInputHandler', 'searchInputHandlerBlur']);

	const props = withDefaults(
		defineProps<{
			placeholder?: string;
			label?: string;
			labelClass?: string;
			maxWidth?: string;
			height?: string;
			items: Map<string | number | null, string> | null;
			visibleItems?: Map<string | number | null, string> | null;
			modelValue: string | number | null;
			maxHeightList?: string;
			error?: { status: boolean; msg?: string | undefined };
			required?: boolean;
			disabled?: boolean;
			disabledText?: string;
			disabledItems?: Map<string | number | null, string> | null;
			positionList?: string;
			theObjectToBeDisplayed?: string;
			isNeedSearch?: boolean;
		}>(),
		{
			maxWidth: '250px',
			maxHeightList: '250px',
			height: '50px',
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

	const searchHandler = () => {
		emit('searchInputHandler', search.value);
	};

	const searchHandlerBlur = () => {
		emit('searchInputHandlerBlur', search.value);
	};

	const selectItemHandler = (key: string | null | number, value: any) => {
		if (props.disabledItems && !props.disabledItems.get(key)) {
			return;
		}
		emit('update:modelValue', key);
		emit('change', key, value);
		closeDropDown();
	};

	const selectItem = computed({
		get() {
			if (props.visibleItems) {
				if (props.theObjectToBeDisplayed) {
					return props.visibleItems?.get(props.modelValue)?.[props.theObjectToBeDisplayed] || '';
				}
				return props.visibleItems?.get(props.modelValue) || '';
			}

			if (props.theObjectToBeDisplayed) {
				return props.items?.get(props.modelValue)?.[props.theObjectToBeDisplayed] || '';
			}
			return props.items?.get(props.modelValue) || '';
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
			top: 100%;
			left: 0;
			width: 100%;
			background: var(--white);
			transform: translate(0px, -7%);
			z-index: 1000;
			border-radius: 20px;
			padding: 20px;
			border: 1px solid var(--gray-100);
			border-top: 0;
			border-top-right-radius: 0;
			border-top-left-radius: 0;
			display: flex;
			flex-direction: column;
			gap: 10px;
			max-height: v-bind(maxHeightList);
			overflow-y: auto;

			.search {
				margin-left: -6px;
				margin-right: -6px;
				padding-bottom: 5px;
			}

			.item {
				opacity: 0.8;
				cursor: pointer;

				&:hover {
					opacity: 1;
				}

				&_active {
					color: var(--violet);
					background-color: var(--lilac);
					font-weight: 600;
					opacity: 1;
					padding: 6px 13px;
					border-radius: $br-1;
					margin-left: -12px;
					margin-right: -12px;
				}
				&_disabled {
					opacity: 0.6;
					cursor: not-allowed;
				}
			}
		}
	}
</style>
