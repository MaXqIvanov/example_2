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
			:input-special-style="{ fontSize: '15px' }"
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
				:class="{ item_active: modelValue === item }"
			>
				<span v-if="typeof item === 'string'">{{ item }}</span>
				<span v-else>
					{{ item.name }}
				</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	const emit = defineEmits(['update:modelValue', 'blur']);

	const props = withDefaults(
		defineProps<{
			placeholder?: string;
			label?: string;
			labelClass?: string;
			maxWidth?: string;
			height?: string;
			items: Array<string> | Array<{ id: string; name: string }> | null;
			modelValue: string | { id: string; name: string } | Record<string, string> | null;
			maxHeightList?: string;
			error?: { status: boolean; msg?: string | undefined };
			theObjectToBeDisplayed?: string;
		}>(),
		{
			maxWidth: '250px',
			maxHeightList: '250px',
			height: '50px'
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

	const selectItemHandler = (value: string | { id: string; name: string }) => {
		emit('update:modelValue', value);
		closeDropDown();
	};

	const selectItem = computed({
		get() {
			if (props.theObjectToBeDisplayed) {
				return props.modelValue?.[props?.theObjectToBeDisplayed] || '';
			} else if (typeof props.modelValue === 'string') return props.modelValue;
			return props.modelValue?.name || null;
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
			gap: 10px;
			max-height: v-bind(maxHeightList);
			overflow-y: auto;

			.item {
				@include body-2;
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
			}
		}
	}
</style>
