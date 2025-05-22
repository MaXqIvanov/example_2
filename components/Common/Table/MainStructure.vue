<template>
	<UiCard
		padding="0"
		class="table"
	>
		<div class="table__left">
			<div class="left__thead">
				<slot name="thead-left" />
			</div>
			<div
				class="left__tbody"
				ref="tbodyLeft"
			>
				<slot name="tbody-left" />
			</div>
		</div>
		<div class="table__right">
			<div class="right__thead">
				<slot name="thead-right" />
			</div>
			<div class="right__tbody">
				<div
					ref="tableRight"
					class="tbody__wrapper"
				>
					<div class="tbody__header">
						<slot name="tbody-right-header" />
					</div>
					<div
						class="tbody__body"
						ref="tbodyRight"
					>
						<slot name="tbody-right-body" />
					</div>
				</div>
				<div
					v-if="$slots['tbody-right-fixed']"
					class="tbody__fixed"
					ref="tbodyRightFixed"
				>
					<slot name="tbody-right-fixed" />
				</div>
			</div>
		</div>
		<div
			v-if="$slots['table-empty']"
			class="table__empty"
		>
			<slot name="table-empty" />
		</div>
	</UiCard>
</template>

<script setup lang="ts">
	import { useScroll } from '@vueuse/core';

	const props = withDefaults(
		defineProps<{
			watchScroll?: boolean;
			infiniteScroll?: boolean;
			leftSideWidth: string;
			leftSideBackgroundColor?: string;
			theadLeftPadding?: string;
			theadRightPadding?: string;
			tbodyRightHeaderHeight: string;
			tbodyRightPaddingInline?: string;
			theadHeight: string;
		}>(),
		{
			watchScroll: false,
			infiniteScroll: false,
			leftSideBackgroundColor: 'var(--white)',
			theadLeftPadding: '27px 21px 14px 21px',
			theadRightPadding: '27px 39px 14px 45px',
			tbodyRightPaddingInline: '45px 39px'
		}
	);

	const emit = defineEmits(['tableScrolling', 'loadMore']);

	const tbodyLeft = ref<HTMLElement | null>(null);
	const tbodyRight = ref<HTMLElement | null>(null);
	const tbodyRightFixed = ref<HTMLElement | null>(null);
	const tableRight = ref<HTMLElement | null>(null);

	const tbodyRightFixedWidth = computed(() =>
		tbodyRightFixed.value ? `${tbodyRightFixed.value.offsetWidth}px` : '0px'
	);

	// add scroll to tbodyRight according to tbodyLeft scroll

	const controlScroll = () => {
		const currentScroll = tbodyLeft.value?.scrollTop || 0;

		if (tbodyRight.value) {
			tbodyRight.value.scrollTo({ top: currentScroll });
		}

		if (tbodyRightFixed.value) {
			tbodyRightFixed.value.scrollTop = currentScroll;
		}

		//infinite scroll
		if (props.infiniteScroll) {
			if (arrivedStateLeft.bottom && directionsLeft.bottom) {
				emit('loadMore');
			}
		}
	};

	onMounted(() => {
		if (tbodyLeft.value) {
			setTimeout(() => {
				tbodyLeft.value?.addEventListener('scroll', controlScroll);
			});
		}
	});

	onUnmounted(() => {
		if (tbodyLeft.value) {
			tbodyLeft.value?.removeEventListener('scroll', controlScroll);
		}
	});

	//watch table scroll

	const {
		isScrolling: isScrollingLeft,
		arrivedState: arrivedStateLeft,
		directions: directionsLeft
	} = useScroll(props.watchScroll || props.infiniteScroll ? tbodyLeft : null);
	const { isScrolling: isScrollingRight } = useScroll(props.watchScroll ? tableRight : null, { throttle: 100 });

	watch([isScrollingLeft, isScrollingRight], () => {
		if (isScrollingLeft.value || isScrollingRight.value) {
			emit('tableScrolling', true);
		} else {
			emit('tableScrolling', false);
		}
	});
</script>

<style scoped lang="scss">
	.table {
		position: relative;
		width: 100%;
		height: 100%;
		min-height: 65vh;
		max-height: 90vh;
		display: grid;
		grid-template-columns: v-bind(leftSideWidth) 100%;

		border-radius: 15px;
		overflow: hidden;

		background-color: var(--white);
		box-shadow: 0 0 20px var(--box-shadow-default);

		@media (max-width: $card-vacancies-lg) {
			min-height: 75vh;
		}

		&__left {
			border-right: 1px solid var(--blue-light-2);
			background-color: v-bind(leftSideBackgroundColor);
			padding-bottom: 53px;
		}

		&__right {
			width: calc(100% - (v-bind(leftSideWidth)));
		}

		&__empty {
			position: absolute;
			top: v-bind(theadHeight);
			left: 0;

			width: 100%;
			height: calc(100% - v-bind(theadHeight));

			display: flex;
			justify-content: center;
			align-items: center;

			background-color: var(--white);
		}
	}

	.left {
		&__thead {
			width: 100%;
			height: v-bind(theadHeight);
			display: flex;

			padding: v-bind(theadLeftPadding);

			border-bottom: 1px solid var(--blue-light-2);
		}

		&__tbody {
			height: fit-content;
			max-height: clamp(calc(65vh - v-bind(theadHeight)), 100vh, calc(100vh - 680px));
			overflow-y: auto;
			overflow-x: hidden;

			margin-top: 10px;

			@media (max-width: $card-vacancies-lg) {
				max-height: clamp(calc(75vh - v-bind(theadHeight)), 100vh, calc(100vh - 680px));
			}
		}
	}

	.right {
		&__thead {
			height: v-bind(theadHeight);

			display: flex;
			justify-content: space-between;
			padding: v-bind(theadRightPadding);

			border-bottom: 1px solid var(--blue-light-2);
		}

		&__tbody {
			display: flex;
			justify-content: space-between;
			height: 100%;
			margin-inline: v-bind(tbodyRightPaddingInline);
			margin-bottom: 30px;

			.tbody {
				&__wrapper {
					overflow-x: auto;
					overflow-y: hidden;
					width: calc(100% - v-bind(tbodyRightFixedWidth));
					height: calc(100% - 90px);
					max-width: 100%;

					margin-top: calc(-1 * v-bind(tbodyRightHeaderHeight));
				}

				&__header {
					width: 100%;
					height: max-content;
					display: flex;
				}

				&__body {
					width: fit-content;
					min-width: 100%;
					height: 100%;
					max-height: clamp(calc(65vh - v-bind(theadHeight)), 100vh, calc(100vh - 680px));
					top: 46px;

					display: flex;
					flex-direction: column;

					overflow-y: hidden;
					overflow-x: hidden;

					margin-top: 10px;

					@media (max-width: $card-vacancies-lg) {
						max-height: clamp(calc(75vh - v-bind(theadHeight)), 100vh, calc(100vh - 680px));
					}
				}

				&__fixed {
					width: fit-content;
					height: fit-content;
					max-height: clamp(calc(65vh - v-bind(theadHeight)), 100vh, calc(100vh - 680px));

					display: flex;
					flex-direction: column;

					overflow-y: hidden;
					overflow-x: hidden;

					margin-top: 10px;

					@media (max-width: $card-vacancies-lg) {
						max-height: clamp(calc(75vh - v-bind(theadHeight)), 100vh, calc(100vh - 680px));
					}
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
		border-radius: 4px;
		background-color: var(--blue-6);
	}
</style>
