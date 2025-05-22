<template>
	<UiModalMobile
		v-model="modelValue"
		:isNeedFixedModalWithIfElseBlock="false"
		:z-index="10000"
		customPadding="10px 25px 20px 25px"
	>
		<div class="header">
			<div class="info">
				<UiIcon
					folder="navigation-element"
					name="nav-subscribe-new"
					color="var(--violet-2)"
					additional-color="var(--white)"
					height="22"
					width="22"
				></UiIcon>
				<div class="title">
					<div class="wrapper">
						<TypographyKTypographyBody3
							color="var(--color_font_black_wite)"
							font-type="bold"
							>{{ $t('settings-page-subscribe-modal-header') }}
						</TypographyKTypographyBody3>
					</div>
				</div>
			</div>
		</div>
		<div class="subscribe__body">
			<div
				class="subscribe__active"
				v-if="subscribeStore.subscribeDetail?.subscription_status"
			>
				<UiIcon
					folder="subscribe"
					name="CheckMark-new"
					color="var(--green-light)"
					additional-color="var(--white)"
					height="48"
					width="48"
				></UiIcon>
				<TypographyKTypographyBody3
					color="var(--color_font_black_wite)"
					font-type="bold"
					class="title"
				>
					{{ $t('settings-page-subscribe-modal-title') }}
				</TypographyKTypographyBody3>
				<div class="block-indicator">
					<div class="date">
						<TypographyKTypographyBody5
							color="var(--dark-gray)"
							font-type="semi-bold"
							>{{ $t('settings-page-subscribe-modal-start') }}
							{{ subscribeDate.dateStartTransform }}</TypographyKTypographyBody5
						>
						<TypographyKTypographyBody5
							color="var(--dark-gray)"
							font-type="semi-bold"
							>{{ $t('settings-page-subscribe-modal-end') }}
							{{ subscribeDate.dateFinishTransform }}</TypographyKTypographyBody5
						>
					</div>
					<div class="indicator">
						<div
							class="filling-line"
							:style="{ width: `${subscribeDate.percentFilling}%` }"
						></div>
						<div
							class="count-day"
							:style="{ left: `${subscribeDate.percentFilling}%` }"
						>
							<TypographyKTypographyBody5
								color="var(--white)"
								font-type="semi-bold"
								>{{ daysLeft }}</TypographyKTypographyBody5
							>
						</div>
						<div
							class="count-day__border"
							:style="{ left: `${subscribeDate.percentFilling}%` }"
						></div>
					</div>
				</div>
			</div>
			<div
				class="subscribe__not-active"
				v-else-if="!subscribeStore.loading.getSubscribeDetail"
			>
				<UiIcon
					folder="subscribe"
					name="CancelMark-new"
					color="#EEEEF7"
					additional-color="#A094B8"
					height="48"
					width="48"
				></UiIcon>
				<TypographyKTypographyBody3
					color="var(--color_font_black_wite)"
					font-type="bold"
					class="title"
				>
					{{ $t('settings-page-subscribe-modal-title-not-acitve') }}
				</TypographyKTypographyBody3>
				<TypographyKTypographyBody5
					color="var(--dark-gray)"
					font-type="semi-bold"
					class="sub-title"
				>
					{{ $t('settings-page-subscribe-modal-top-up-balance') }}
				</TypographyKTypographyBody5>
				<div class="banner">
					<TypographyKTypographyH4
						class="count-month"
						font-type="bold"
						color="var(--color_font_black_wite)"
						>{{ subscribeStore.subscribeDetail?.next.period }}</TypographyKTypographyH4
					>
					<TypographyKTypographyBody3
						class="title-month"
						font-type="bold"
						color="var(--dark-gray)"
						>{{ subscribeStore.subscribeDetail?.next.period_description }}</TypographyKTypographyBody3
					>
					<TypographyKTypographyBody3
						class="cost"
						font-type="bold"
						color="var(--color_font_black_wite)"
						>{{ subscribeStore.subscribeDetail?.next.subscription_cost }} USDT</TypographyKTypographyBody3
					>
					<UiButton
						:color="ButtonType.outlineV2"
						:size="ButtonSizeType.small"
						class="btn__activate"
						:style="{ width: 'fit-content' }"
						@click="activateSubscribeHandler"
						><TypographyKTypographyBody4
							color="var(--outline)"
							font-type="semi-bold"
						>
							{{ $t('settings-page-subscribe-modal-btn-activate') }}
						</TypographyKTypographyBody4></UiButton
					>
				</div>
			</div>
		</div>
		<template #custom-actions />

		<UiModalConfirm
			v-model="isModalConfirmOpen"
			v-if="isModalConfirmOpen"
			:title="$t('settings-page-subscribe-modal-confirm-title')"
			@save="confirmActivateSubscribeHandler"
		/>
	</UiModalMobile>
</template>

<script setup lang="ts">
	import { getPluralizationText } from '~/helpers/i18n';
	import { ButtonSizeType, ButtonType } from '~/interfaces/ui';
	import { useSubscribeStore } from '~/store/subscribe';

	const modelValue = defineModel('modelValue', { required: true, type: Boolean });
	const props = withDefaults(
		defineProps<{
			height: string;
		}>(),
		{ height: 'calc(100% - 119px)' }
	);
	const subscribeStore = useSubscribeStore();
	const isModalConfirmOpen = ref(false);

	const subscribeDate = computed(() => {
		if (!subscribeStore.subscribeDetail) {
			return {
				countMonth: 0,
				dateStartTransform: `-`,
				dateFinishTransform: `-`,
				percentFilling: 0,
				daysInDateStartFinish: 0
			};
		}

		const dateStart: string[] | undefined = subscribeStore.subscribeDetail?.cur.DtStart.split('-');
		const dateFinish: string[] | undefined = subscribeStore.subscribeDetail?.cur.DtFinish.split('-');
		let sumMonth = 0;
		const year = Number(dateFinish[0]) - Number(dateStart[0]);
		const month = Number(dateFinish[1]) - Number(dateStart[1]);
		const days = Number(dateFinish[2]) - Number(dateStart[2]);
		const daysInDateStartFinish =
			Math.floor(
				new Date(subscribeStore.subscribeDetail?.cur.DtFinish).getTime() -
					new Date(subscribeStore.subscribeDetail?.cur.DtStart).getTime()
			) /
			(1000 * 60 * 60 * 24);
		const percent = (subscribeStore.subscribeDetail.cur.DaysLeft / daysInDateStartFinish) * 100;

		sumMonth = year > 0 ? year * 12 : 0 + month + days > 0 ? 1 : 0;

		return {
			countMonth: sumMonth,
			dateStartTransform: `${dateStart[2]}.${dateStart[1]}.${dateStart[0]}`,
			dateFinishTransform: `${dateFinish[2]}.${dateFinish[1]}.${dateFinish[0]}`,
			percentFilling: percent < 10 ? 3 : percent > 96 ? 97 : percent,
			daysInDateStartFinish: daysInDateStartFinish
		};
	});
	const daysLeft = computed(() => {
		if (subscribeStore.subscribeDetail) {
			return subscribeStore.subscribeDetail?.cur.DaysLeft;
		}
		return 0;
	});

	const activateSubscribeHandler = () => {
		isModalConfirmOpen.value = true;
	};

	const confirmActivateSubscribeHandler = async () => {
		await subscribeStore.activateSubscribe();
		isModalConfirmOpen.value = false;
	};
</script>

<style scoped lang="scss">
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid var(--violet-5);
		padding-bottom: 14px;
		margin-bottom: 15px;
		min-height: 47px;

		.info {
			display: flex;
			align-items: center;
			width: 100%;
			gap: 9px;
			padding-top: 0px;

			.title {
				display: flex;
				flex-direction: column;
				gap: 7px;
				width: 100%;

				.wrapper {
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
					gap: 4px;
				}
			}
		}
	}
	.subscribe__body {
		display: flex;
		flex-direction: column;
		gap: 20px;
		margin-top: 20px;
		border-radius: 15px;
		height: calc(100% - 60px);
		padding: 0px 0px;

		.subscribe__not-active {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width: 100%;

			.banner {
				display: flex;
				flex-direction: column;
				align-items: center;
				width: 100%;
				margin-top: 14px;
				background-color: var(--color_bottomsheet);
				padding: 29px 40px;
				border-radius: 15px;

				.count-month {
				}

				.title-month {
				}

				.cost {
					margin-top: 12px;
				}

				.btn__activate {
					margin-top: 22px;
					width: 100%;
				}
			}

			.sub-title {
				display: inline-flex;
				margin-top: 8px;
			}

			.title {
				display: inline-flex;
				margin-top: 15px;
				gap: 5px;
			}
		}

		.subscribe__active {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.block-indicator {
				margin-top: 17px;
				width: 100%;
				display: flex;
				flex-direction: column;
				.date {
					display: flex;
					width: 100%;
					justify-content: space-between;
				}
				.indicator {
					position: relative;
					background-color: var(--gray-12);
					height: 10px;
					border-radius: 25px;
					margin-top: 23px;
					margin-left: 9px;
					margin-right: 9px;

					.filling-line {
						position: absolute;
						height: 10px;
						left: 0px;
						background-color: var(--icon-navigation-gold);
						border-top-left-radius: 25px;
						border-bottom-left-radius: 25px;
					}
					.count-day {
						position: absolute;
						background-color: var(--icon-navigation-gold);
						border-radius: 50%;
						width: 29px;
						height: 29px;
						top: 50%;
						display: flex;
						justify-content: center;
						align-items: center;
						transform: translate(-50%, -50%);
						z-index: 10;
						&__border {
							height: 38px;
							width: 38px;
							top: 50%;

							border-radius: 50%;
							position: absolute;
							z-index: 9;
							transform: translate(-50%, -50%);
							background-color: rgba(114, 56, 134, 0.18);
						}
					}
				}
			}

			.title {
				display: inline-flex;
				margin-top: 15px;
				gap: 5px;
			}
		}
	}
</style>
