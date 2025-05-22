<template>
	<div
		class="ui-select"
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
		>
			<div
				v-if="!items?.length"
				class="item"
			>
				<span>Список пуст</span>
			</div>
			<div
				v-else
				class="item"
				v-for="item in items"
				@click="selectItemHandler(item)"
				:class="{ item_active: checkActiveHandler(item) }"
			>
				<UiCheckBox
					v-if="type === 'checkbox'"
					:model-value="checkActiveHandler(item)"
					@click.prevent
				></UiCheckBox>
				<span v-if="typeof item === 'string'">{{ item }}</span>
				<span v-else>
					{{ item.name }}
				</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	// todo добавить поддержку для объектов
	const emit = defineEmits(['update:modelValue', 'blur']);

	const props = withDefaults(
		defineProps<{
			type?: 'default' | 'checkbox';
			placeholder?: string;
			label?: string;
			labelClass?: string;
			maxWidth?: string;
			height?: string;
			items: Array<string> | Array<{ id: string; name: string }> | null;
			modelValue: Array<string> | string | null;
			maxHeightList?: string;
			error?: { status: boolean; msg?: string | undefined };
		}>(),
		{
			maxWidth: '250px',
			maxHeightList: '250px',
			height: '50px',
			type: 'checkbox'
		}
	);

	const isOpenDropDown = ref(false);
	const openDropDown = () => {
		isOpenDropDown.value = true;
	};

	const closeDropDown = () => {
		isOpenDropDown.value = false;
		emit('blur', selectItem.value);
	};

	const checkActiveHandler = (item: string | { id: string; name: string }) => {
		return (
			typeof item === 'string' && typeof props.modelValue === 'string' && props.modelValue.split(',')?.includes(item)
		);
	};

	const selectItemHandler = (value: string | { id: string; name: string }) => {
		if (typeof value === 'string' && typeof props.modelValue === 'string') {
			const items = props.modelValue.split(',');
			if (items.includes(value)) {
				emit('update:modelValue', items.filter((item) => item !== value).join(','));
				return;
			}
			emit('update:modelValue', props.modelValue + (props.modelValue.length === 0 ? '' : ',') + value);
		}
	};

	const selectItem = computed({
		get() {
			if (props.items && typeof props.items[0] === 'string' && typeof props.modelValue === 'string') {
				return props.modelValue || null;
			}
			return null;
		},
		set(value) {
			emit('update:modelValue', value);
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
