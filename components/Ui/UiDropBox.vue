<template>
	<div
		class="ui-drop-box"
		:style="{ maxWidth: maxWidth, backgroundColor: btnColor, maxHeight: maxHeight }"
		ref="parentRef"
	>
		<div
			class="dropbox-body"
			@click="clickHandler"
			:style="{ padding: paddingBody }"
		>
			<slot />
		</div>
		<ul
			v-if="isVisibleItems"
			:class="['list', { 'list--with-separators': isNeedSeparateLine }]"
			:style="{ backgroundColor: listColor, boxShadow: listBoxShadow, minWidth: minWidthList }"
			ref="listRef"
		>
			<li
				v-for="item in items"
				:class="[
					'item',
					'k-typography-body-2',
					customClassForItems,
					{ 'item--reversed': item.icon?.position === 'right', 'item--disabled': item?.disabled }
				]"
				@click="selectHandler(item)"
			>
				<div
					v-if="item.icon"
					:class="{ 'icon-wrapper--background': item.icon.hasBackground }"
				>
					<UiIcon
						:name="item.icon.name"
						:color="item.icon.color ?? undefined"
						width="16"
						height="16"
					/>
				</div>
				<span>{{ item.title }}</span>
			</li>
			<li>
				<slot name="list-item" />
			</li>
		</ul>
		<div
			class="ui-drop-box__arrow"
			v-if="isNeedArrow"
			@click="clickHandler"
			:style="{ ...(customStyleIconRight ?? customStyleIconRight) }"
		>
			<UiIcon
				name="arrow"
				width="12"
				height="12"
				:rotation="isVisibleItems ? '180' : '0'"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
	const emit = defineEmits(['select']);

	const isVisibleItems = ref(false);

	const parentRef = ref<HTMLElement | null>(null);
	const listRef = ref<HTMLElement | null>(null);

	const props = withDefaults(
		defineProps<{
			items: Array<{
				id: number;
				icon?: { name: string; color?: string; position?: 'left' | 'right'; hasBackground?: boolean };
				title: string;
				disabled?: boolean;
			}>;
			maxWidth?: string;
			minWidthList?: string;
			maxHeight?: string;
			listColor?: string;
			listBoxShadow?: string;
			btnColor?: string;
			isNeedArrow?: boolean;
			paddingBody?: string;
			isNeedSeparateLine?: boolean;
			customStyleIconRight?: Record<string, string>;
			customClassForItems?: string;
		}>(),
		{
			maxWidth: '220px',
			minWidthList: 'unset',
			maxHeight: '48px',
			listColor: 'var(--white)',
			listBoxShadow: '0px 6px 58px 0px #C4CBD61A',
			btnColor: 'transparent',
			isNeedArrow: true,
			paddingBody: '8px 20px'
		}
	);

	watch(isVisibleItems, (value) => {
		if (parentRef.value) {
			parentRef.value.style.overflow = 'hidden';
			setTimeout(() => {
				if (parentRef.value && listRef.value) {
					const rightOffset = listRef.value.getBoundingClientRect().right - window.innerWidth + 20;
					if (rightOffset > 0) {
						listRef.value.style.right = `calc(50% + ${rightOffset}px)`;
					}
					parentRef.value.style.overflow = 'unset';
				}
			});
		}

		if (value) {
			setTimeout(() => {
				document.addEventListener('click', clickHandler);
			});
		} else document.removeEventListener('click', clickHandler);
	});

	const clickHandler = () => {
		isVisibleItems.value = !isVisibleItems.value;
	};

	const selectHandler = (value: (typeof props.items)[0]) => {
		if (value?.disabled) return;
		emit('select', value);
	};
</script>

<style scoped lang="scss">
	.ui-drop-box {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		border-radius: 14px;
		word-break: break-all;

		.dropbox-body {
			display: flex;
			align-items: center;
			width: 100%;
			cursor: pointer;
		}

		&__arrow {
			display: flex;
			position: absolute;
			top: 50%;
			right: 10px;
			transform: translate(-50%, -50%);
			cursor: pointer;
			z-index: 0;
		}
	}

	.list {
		position: absolute;
		display: flex;
		flex-direction: column;
		gap: 15px;
		top: 60px;
		right: 50%;
		width: 100%;
		transform: translate(50%, 0px);
		border-radius: 20px;
		padding: 23px;
		animation: visible 0.35s linear;
		z-index: 1000;

		&--with-separators {
			& > li:not(:last-child) {
				padding-bottom: 13px;
				border-bottom: 1px solid var(--blue-light-2);
			}
		}

		.item {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 12px;
			cursor: pointer;

			&--disabled {
				cursor: not-allowed;
				opacity: 0.5;
			}

			&--reversed {
				flex-direction: row-reverse;
			}

			.icon-wrapper--background {
				display: flex;
				width: max-content;
				background: var(--blue-light);
				padding: 8px;
				box-sizing: content-box;
				border-radius: 10px;
			}
		}
	}

	@keyframes visible {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}
</style>
